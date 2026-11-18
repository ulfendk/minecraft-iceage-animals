// Renders every animal side-on at the same scale, standing on one ground line next to a
// player silhouette (1.8 m), sorted by height: build/lineup.png (and docs/lineup.png with
// --docs). A quick visual check that the sizes in src/sizes.mjs came out right.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { build } from './build.mjs';
import { render } from './render.mjs';
import { measure } from '../src/lib/measure.mjs';

const PX_PER_M = 48;
const GROUND = 24; // px of ground strip under the animals
const RP = 'build/resource_pack';

/** A single render cropped to its opaque pixels: { png, w, h }. */
function crop(buf) {
  const src = PNG.sync.read(buf);
  let x0 = src.width, x1 = -1, y0 = src.height, y1 = -1;
  for (let y = 0; y < src.height; y++)
    for (let x = 0; x < src.width; x++)
      if (src.data[(y * src.width + x) * 4 + 3] > 10) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
  return { src, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

export async function lineup({ animals, out = 'build/lineup.png' } = {}) {
  animals ??= (await build({ quiet: true })).animals;
  const items = [];
  for (const a of animals) {
    const geo = JSON.parse(await readFile(join(RP, 'models/entity', `${a.id}.geo.json`), 'utf8'));
    const tex = await readFile(join(RP, 'textures/entity/iceage', `${a.id}.png`));
    // Side view (yaw 90, no pitch): model y maps straight to screen y, so the render's scale
    // (pixels per model pixel) gives the same pixels per metre for every animal.
    const scale = (PX_PER_M * (a.scale ?? 1)) / 16;
    const size = Math.ceil(scale * 160);
    items.push({ a, h: measure(a).height, img: crop(render(geo, tex, { yaw: 90, pitch: 0, size, scale, hidden: new Set(['saddle', 'chest']) })) });
  }
  items.sort((x, y) => y.h - x.h);
  // The player: a 1.8 m tall, 0.6 m wide figure.
  const player = { w: Math.round(0.6 * PX_PER_M), h: Math.round(1.8 * PX_PER_M) };
  const gap = 16;
  const width = gap + player.w + gap + items.reduce((s, i) => s + i.img.w + gap, 0);
  const height = Math.max(...items.map((i) => i.img.h), player.h) + GROUND + 40;
  const png = new PNG({ width, height });
  const base = height - GROUND;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const sky = y < base ? [214 - y / 20, 228 - y / 30, 238, 255] : [236, 242, 246, 255];
      png.data.set(sky.map(Math.round), (y * width + x) * 4);
    }
  // Metre lines.
  for (let m = 1; m * PX_PER_M < base; m++) {
    const y = base - m * PX_PER_M;
    for (let x = 0; x < width; x += 2) png.data.set([170, 190, 205, 255], (y * width + x) * 4);
  }
  let x = gap;
  for (let y = base - player.h; y < base; y++)
    for (let dx = 0; dx < player.w; dx++) png.data.set([40, 48, 60, 255], (y * width + x + dx) * 4);
  x += player.w + gap;
  for (const { img } of items) {
    for (let y = 0; y < img.h; y++)
      for (let dx = 0; dx < img.w; dx++) {
        const s = ((img.y0 + y) * img.src.width + img.x0 + dx) * 4;
        if (img.src.data[s + 3] < 10) continue;
        png.data.set(img.src.data.subarray(s, s + 4), ((base - img.h + y) * width + x + dx) * 4);
      }
    x += img.w + gap;
  }
  await writeFile(out, PNG.sync.write(png));
  return { out, order: items.map((i) => i.a.id) };
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const docs = process.argv.includes('--docs');
  if (docs) await mkdir('docs', { recursive: true });
  const { out, order } = await lineup({ out: docs ? 'docs/lineup.png' : 'build/lineup.png' });
  console.log(`${out}: ${order.join(', ')}`);
}
