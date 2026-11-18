// Measures a model in its rest pose, in metres, the way zoologists measure the real
// animal: shoulder height at the withers and head-and-body length (nose to rump). Used by
// the size check in tools/validate.mjs and the website's size labels.
//
// Bone and cube rotations are applied, so a lowered head or a tilted neck counts as it
// looks. Long hair, horns, tusks, antlers, trunks, ears, tails and tack are left out.

const deg = Math.PI / 180;
const SKIP_MATS = new Set(['horn', 'tusk', 'antler', 'trunk', 'ear', 'tail', 'tuft', 'saddle', 'blanket', 'chest', 'skirt', 'mane', 'shag', 'claw', 'club', 'spike']);
const SKIP_BONES = /^(trunk|tusk|horn|antler|ear|tail|saddle|chest|jaw|club)/;

const I = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function mul(a, b) {
  const o = new Array(16).fill(0);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      for (let k = 0; k < 4; k++) o[r * 4 + c] += a[r * 4 + k] * b[k * 4 + c];
  return o;
}
const T = ([x, y, z]) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
const Rx = (t) => { const c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]; };
const Ry = (t) => { const c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]; };
const Rz = (t) => { const c = Math.cos(t), s = Math.sin(t); return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; };
// Same rotation convention as tools/render.mjs (Bedrock: x, then y, then z).
const R = ([x, y, z]) => mul(Rz(-z * deg), mul(Ry(y * deg), Rx(-x * deg)));
const around = (pivot, rot) => mul(T(pivot), mul(R(rot), T(pivot.map((v) => -v))));
const apply = (m, [x, y, z]) => [m[0] * x + m[1] * y + m[2] * z + m[3], m[4] * x + m[5] * y + m[6] * z + m[7], m[8] * x + m[9] * y + m[10] * z + m[11]];

/** Every cube's 8 corners in model space (pixels), with the bone it belongs to. */
export function posedCubes(model) {
  const world = {};
  const out = [];
  for (const bone of model.bones) {
    let m = bone.parent ? world[bone.parent] : I();
    m = mul(m, around(bone.pivot ?? [0, 0, 0], bone.rotation ?? [0, 0, 0]));
    world[bone.name] = m;
    for (const cube of bone.cubes ?? []) {
      const cm = cube.rotation ? mul(m, around(cube.pivot ?? cube.origin.map((o, i) => o + cube.size[i] / 2), cube.rotation)) : m;
      const [x0, y0, z0] = cube.origin;
      const [x1, y1, z1] = cube.origin.map((o, i) => o + cube.size[i]);
      const corners = [];
      for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) corners.push(apply(cm, [x, y, z]));
      out.push({ bone: bone.name, cube, corners });
    }
  }
  return out;
}

const counts = ({ bone, cube }) => !cube.hair && !SKIP_MATS.has(cube.mat) && !SKIP_BONES.test(bone) && cube.size.every((s) => s > 0);

/**
 * { shoulder, length, height } in metres for a spec with `model` and `scale`:
 * shoulder = top of the body bone; length = front of the head (or neck/body) to the back
 * of the body; height = the tallest point of the whole model, everything included.
 */
export function measure(a) {
  const k = (a.scale ?? 1) / 16;
  const cubes = posedCubes(a.model);
  const body = cubes.filter((c) => c.bone === 'body' && counts(c));
  if (!body.length) throw new Error(`${a.id}: no body bone to measure`);
  const ys = (list) => list.flatMap((c) => c.corners.map((p) => p[1]));
  const zs = (list) => list.flatMap((c) => c.corners.map((p) => p[2]));
  const front = cubes.filter(counts);
  return {
    shoulder: Math.max(...ys(body)) * k,
    length: (Math.max(...zs(body)) - Math.min(...zs(front))) * k,
    height: Math.max(...ys(cubes)) * k,
  };
}

/** Size check against src/sizes.mjs: a list of problems (empty when the model fits). */
export function sizeProblems(a, sizes, tolerance = 0.1) {
  const want = sizes[a.id];
  if (!want) return [`${a.id}: no real size in src/sizes.mjs`];
  const got = measure(a);
  const out = [];
  for (const key of ['shoulder', 'length']) {
    const ratio = got[key] / want[key];
    if (Math.abs(ratio - 1) > tolerance) {
      out.push(`${a.id}: ${key} is ${got[key].toFixed(2)} m, the real animal's is ${want[key]} m (${Math.round((ratio - 1) * 100)}%)`);
    }
  }
  // The collision box should stand at least as tall as most of the back.
  const hb = (a.size[1] * (a.scale ?? 1));
  if (hb < got.shoulder * 0.8) out.push(`${a.id}: hitbox is ${hb.toFixed(2)} m tall but the back is at ${got.shoulder.toFixed(2)} m`);
  return out;
}
