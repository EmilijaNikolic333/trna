// Pretvara originale (JPG/PNG/HEIC/CR2) u web JPG-ove, čita datume i pravi src/slike.json
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';
import exifr from 'exifr';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'originali');
const OUT = path.join(ROOT, 'public', 'slike');
const THUMBS = path.join(ROOT, 'pregled');

// CR2 je TIFF; IFD0 (StripOffsets/StripByteCounts) pokazuje na pun JPG pregled
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
  if (ext === '.heic') return Buffer.from(await heicConvert({ buffer: buf, format: 'JPEG', quality: 0.92 }));
  if (ext === '.cr2') return jpgIzCr2(buf);
  return buf;
}

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(THUMBS, { recursive: true });

const files = (await fs.readdir(SRC)).sort();
const slike = [];
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, path.extname(file));
  if (ext === '.mov') continue; // video nije u albumu
  let datum = null;
  try {
    const exif = await exifr.parse(path.join(SRC, file), ['DateTimeOriginal', 'CreateDate']);
    datum = exif?.DateTimeOriginal || exif?.CreateDate || null;
  } catch {}
  try {
    const input = await ulaz(file);
    const ime = `${base}.jpg`.replace(/\s+/g, '_');
    const img = sharp(input).rotate();
    const info = await img
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT, ime));
    await sharp(path.join(OUT, ime)).resize({ width: 240, height: 240, fit: 'inside' }).toFile(path.join(THUMBS, ime));
    slike.push({ ime, original: file, w: info.width, h: info.height, datum: datum ? new Date(datum).toISOString() : null });
    process.stdout.write('.');
  } catch (e) {
    console.log(`\nNE MOGU ${file}: ${e.message}`);
  }
}
slike.sort((a, b) => (a.datum || '9999').localeCompare(b.datum || '9999') || a.ime.localeCompare(b.ime));
await fs.writeFile(path.join(ROOT, 'src', 'slike-meta.json'), JSON.stringify(slike, null, 1));
console.log(`\nGotovo: ${slike.length} slika`);
