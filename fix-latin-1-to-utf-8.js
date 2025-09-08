#!/usr/bin/env node
// fix-encoding.mjs
import fs from 'node:fs'
import path from 'node:path'
import jschardet from 'jschardet'
import iconv from 'iconv-lite'

const root = process.cwd()
const inputDir = path.join(root, 'input')
const outputDir = path.join(root, 'output')

// Ausgabe-Ordner anlegen, falls nicht vorhanden
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Hilfsfunktionen
function looksLikeMojibake(str) {
  return /Ã„|Ã–|Ãœ|Ã¤|Ã¶|Ã¼|ÃŸ/.test(str)
}

function latin1Utf8Fix(str) {
  return Buffer.from(str, 'latin1').toString('utf8')
}

function normalizeUnicode(str) {
  return str.normalize('NFC')
}

function decodeBufferGuess(buf) {
  try {
    const asUtf8 = buf.toString('utf8')
    if (!asUtf8.includes('\uFFFD')) {
      if (looksLikeMojibake(asUtf8)) {
        const cured = latin1Utf8Fix(asUtf8)
        return normalizeUnicode(cured)
      }
      return normalizeUnicode(asUtf8)
    }
  } catch (_) {}

  const det = jschardet.detect(buf)
  const enc = (det.encoding || '').toLowerCase()
  if (enc && iconv.encodingExists(enc)) {
    return normalizeUnicode(iconv.decode(buf, enc))
  }
  return normalizeUnicode(iconv.decode(buf, 'latin1'))
}

function processFile(inPath, outPath) {
  const buf = fs.readFileSync(inPath)
  let text = decodeBufferGuess(buf)
  text = text.replace(/Â(?=\s)/g, '') // häufiges Artefakt
  fs.writeFileSync(outPath, text, 'utf8')
}

// Dateien im input-Verzeichnis abarbeiten
const files = fs.readdirSync(inputDir).filter(f =>
  fs.statSync(path.join(inputDir, f)).isFile()
)

if (files.length === 0) {
  console.error('Keine Dateien in ./input gefunden.')
  process.exit(1)
}

for (const f of files) {
  const inPath = path.join(inputDir, f)
  const outPath = path.join(outputDir, f)
  try {
    processFile(inPath, outPath)
    console.log(`✓ ${f} -> output/${f}`)
  } catch (err) {
    console.error(`✗ ${f}: ${err.message}`)
  }
}
