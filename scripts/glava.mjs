// Iseca Trninu glavu sa slike originali/_korica-trna-3.png po glatkoj konturi oko kose,
// za karikaturu na korici
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const K = 2; // uvećavamo pre sečenja da ivica bude glatka

// isečak oko glave u koordinatama originala (335x335)
const IZ = { left: 70, top: 0, width: 225, height: 265 };
const W = IZ.width * K;
const H = IZ.height * K;

// kontura kose i lica (koordinate originala), u smeru kazaljke
const KONTURA = [
  [126, 4], [170, 0], [215, 3], [240, 24], [252, 55], [258, 95], [263, 135], [268, 175],
  [275, 212], [284, 248], [262, 258], [232, 246], [200, 240], [165, 240], [132, 244], [104, 256],
  [90, 250], [84, 214], [80, 175], [78, 135], [80, 95], [87, 55], [102, 26],
];

// Catmull-Rom -> Bezier, da ivica bude glatka
function glatkaPutanja(t) {
  const p = t.map(([x, y]) => [(x - IZ.left) * K, (y - IZ.top) * K]);
  const n = p.length;
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p[(i - 1 + n) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1},${c2},${p2}`;
  }
  return d + 'Z';
}

const maskaSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="#000"/>
  <path d="${glatkaPutanja(KONTURA)}" fill="#fff"/>
</svg>`;
const maska = await sharp(Buffer.from(maskaSvg)).blur(1.5).extractChannel(0).raw().toBuffer();

const { data } = await sharp(path.join(ROOT, 'originali', '_korica-trna-3.png'))
  .removeAlpha()
  .extract(IZ)
  .resize(W, H, { kernel: 'lanczos3' })
  .sharpen({ sigma: 1 })
  .raw()
  .toBuffer({ resolveWithObject: true });

// sharp ne poštuje redosled operacija, pa krećemo od sirovog RGB-a
await sharp(data, { raw: { width: W, height: H, channels: 3 } })
  .joinChannel(maska, { raw: { width: W, height: H, channels: 1 } })
  .png()
  .toFile(path.join(ROOT, 'public', 'korica-glava.png'));
console.log('ok', W, H);
