// Pravi stampa/stikeri.pdf iz /stikeri.html (dev server mora da radi: npm run dev)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const URL = process.argv[2] || 'http://localhost:5173/stikeri.html';
const pregledaci = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const exe = pregledaci.find(p => fs.existsSync(p));
const izlaz = path.join(ROOT, 'stampa', 'stikeri.pdf');
fs.mkdirSync(path.dirname(izlaz), { recursive: true });
execFileSync(exe, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=15000',
  `--print-to-pdf=${izlaz}`,
  URL,
]);
console.log(`Gotovo: ${izlaz}`);
