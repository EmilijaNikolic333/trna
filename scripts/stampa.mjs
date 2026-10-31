// Slike za štampu: svaka slika iz albuma, iz originala, u svom pravom odnosu (bez sečenja i bez belog),
// najviše 10×15 cm na 300 dpi, plus kartice 10×15 (naslovna i poglavlja) iz /kartice.html.
// Sve numerisano redom kao u albumu -> stampa/slike/. Za kartice mora da radi dev server (npm run dev).
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'originali');
const OUT = path.join(ROOT, 'stampa', 'slike');
const meta = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'slike-meta.json'), 'utf8'));
const grupe = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'poglavlja.json'), 'utf8'));

const redosled = ['cheer', 'putovanja', 'fakultet', 'zurke', 'svadba', 'gluposti'];
const KRATKA = 1181; // 10 cm na 300 dpi
const DUGA = 1772; // 15 cm
const KARTICE_URL = process.argv[2] || 'http://localhost:5173/kartice.html';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p =>
  existsSync(p),
);

function jpgIzCr2(b) {
  const le = b.toString('ascii', 0, 2) === 'II';
  const u16 = o => (le ? b.readUInt16LE(o) : b.readUInt16BE(o));
  const u32 = o => (le ? b.readUInt32LE(o) : b.readUInt32BE(o));
  const ifd = u32(4);
  let off, len;
  for (let i = 0; i < u16(ifd); i++) {
    const e = ifd + 2 + i * 12;
    if (u16(e) === 0x111) off = u32(e + 8);
    if (u16(e) === 0x117) len = u32(e + 8);
  }
  return b.subarray(off, off + len);
}

async function ulaz(file) {
  const ext = path.extname(file).toLowerCase();
  const buf = await fs.readFile(path.join(SRC, file));
  if (ext === '.heic') return Buffer.from(await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.95 }));
  if (ext === '.cr2') return jpgIzCr2(buf);
  return buf;
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

// kartica se slika u 378×567 css px (10×15 cm) puta 3.125 = 300 dpi
async function kartica(k, ime) {
  const png = path.join(OUT, '_kartica.png');
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=378,567',
    '--force-device-scale-factor=3.125',
    '--virtual-time-budget=15000',
    `--screenshot=${png}`,
    `${KARTICE_URL}?k=${k}`,
  ], { stdio: 'ignore' });
  await sharp(png).resize(KRATKA, DUGA).withMetadata({ density: 300 }).jpeg({ quality: 95 }).toFile(path.join(OUT, ime));
  await fs.rm(png);
}

let br = 0;
const broj = () => String(br++).padStart(3, '0');
await kartica('naslovna', `${broj()}-naslovna.jpg`);
for (const kljuc of redosled) {
  await kartica(kljuc, `${broj()}-${kljuc}-kartica.jpg`);
  for (const ime of grupe[kljuc].filter(x => x !== '|')) {
    const s = meta.find(m => m.ime === ime);
    const slika = sharp(await ulaz(s.original)).rotate();
    const { data, info } = await slika.toBuffer({ resolveWithObject: true });
    const uspravna = info.height >= info.width;
    const [w, h] = uspravna ? [KRATKA, DUGA] : [DUGA, KRATKA];
    await sharp(data)
      .resize({ width: w, height: h, fit: 'inside' })
      .withMetadata({ density: 300 })
      .jpeg({ quality: 95 })
      .toFile(path.join(OUT, `${broj()}-${kljuc}.jpg`));
    process.stdout.write('.');
  }
}
console.log(`
Gotovo: ${br} fajlova u stampa/slike`);
