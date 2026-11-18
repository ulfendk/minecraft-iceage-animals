// Pack icon: a woolly mammoth on the snowy steppe under a pale winter sky, drawn at 32x32
// and scaled up.
import { PNG } from 'pngjs';
import { hex, mix } from './texture.mjs';

export function packIcon(scale = 8) {
  const N = 32;
  const px = Array.from({ length: N }, () => new Array(N));
  const sky = [hex('#4f7fa3'), hex('#9cc3dc'), hex('#e3eef4')];
  for (let y = 0; y < N; y++) {
    const t = y / 22;
    const c = t < 0.6 ? mix(sky[0], sky[1], t / 0.6) : mix(sky[1], sky[2], Math.min(1, (t - 0.6) / 0.4));
    for (let x = 0; x < N; x++) px[y][x] = c;
  }
  // Low winter sun.
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const d = Math.hypot(x - 6, y - 9);
    if (d < 4) px[y][x] = mix(hex('#fff8e0'), hex('#f6e2a8'), d / 4);
  }
  // Distant hills and the snowy ground.
  for (let x = 0; x < N; x++) {
    const hill = 20 + Math.round(Math.sin(x / 5) * 1.5 + Math.sin(x / 2.3) * 0.6);
    for (let y = hill; y < N; y++) px[y][x] = y < 23 ? hex('#c9dae4') : y === 23 ? hex('#f4f8fa') : mix(hex('#e8f0f4'), hex('#cfdee8'), (y - 24) / 8);
  }
  const fill = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (y >= 0 && y < N && x >= 0 && x < N) px[y][x] = hex(c); };
  // Mammoth (facing left): domed head, sloping back, shaggy coat, tusks curling up.
  const fur = '#6b4126', dark = '#4e2e1a', light = '#8a5a34';
  fill(13, 11, 26, 20, fur); // body
  fill(14, 9, 22, 10, fur); fill(15, 8, 20, 8, light); // shoulder hump
  fill(23, 12, 26, 12, light); // sloping rump
  fill(8, 9, 14, 17, fur); fill(9, 7, 13, 8, fur); fill(10, 6, 12, 6, dark); // head and dome
  fill(7, 17, 9, 22, dark); fill(7, 23, 8, 23, dark); // trunk
  fill(10, 12, 10, 12, '#1a120c'); // eye
  fill(13, 21, 26, 22, dark); // long hair skirt
  for (let x = 13; x <= 26; x += 2) fill(x, 23, x, 23, dark);
  fill(14, 21, 16, 26, dark); fill(19, 21, 21, 26, dark); fill(23, 21, 25, 26, dark); // legs
  fill(27, 13, 27, 17, dark); // tail
  // Tusks: down, forward, then up.
  const tusk = '#f1e6c8';
  fill(9, 18, 10, 19, tusk); fill(6, 20, 9, 20, tusk); fill(4, 19, 5, 20, tusk); fill(3, 16, 4, 18, tusk); fill(4, 15, 4, 15, tusk);

  const png = new PNG({ width: N * scale, height: N * scale });
  for (let y = 0; y < N * scale; y++) for (let x = 0; x < N * scale; x++) {
    png.data.set(px[Math.floor(y / scale)][Math.floor(x / scale)], (y * N * scale + x) * 4);
  }
  return PNG.sync.write(png);
}
