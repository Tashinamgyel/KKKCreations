import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const assetDirectory = path.resolve('public/assets')

await mkdir(assetDirectory, { recursive: true })

const fontSourceDirectory = path.resolve(
  'node_modules/@fontsource/cormorant-garamond/files',
)
const fonts = [
  ['cormorant-garamond-latin-400-normal.woff2', 'cormorant-garamond-v1-400.woff2'],
  ['cormorant-garamond-latin-400-italic.woff2', 'cormorant-garamond-v1-400-italic.woff2'],
  ['cormorant-garamond-latin-500-normal.woff2', 'cormorant-garamond-v1-500.woff2'],
  ['cormorant-garamond-latin-600-normal.woff2', 'cormorant-garamond-v1-600.woff2'],
  ['cormorant-garamond-latin-700-normal.woff2', 'cormorant-garamond-v1-700.woff2'],
]

await Promise.all(
  fonts.map(([source, destination]) =>
    copyFile(
      path.join(fontSourceDirectory, source),
      path.join(assetDirectory, destination),
    ),
  ),
)

const heroInput = path.join(assetDirectory, 'kkk-hero.png')
const heroWidths = [768, 1280, 1672]

await Promise.all(
  heroWidths.flatMap((width) => [
    sharp(heroInput)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 60, effort: 5 })
      .toFile(path.join(assetDirectory, `kkk-hero-v1-${width}.avif`)),
    sharp(heroInput)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(assetDirectory, `kkk-hero-v1-${width}.webp`)),
  ]),
)

const atlasInput = path.join(assetDirectory, 'work-atlas.png')

await Promise.all([
  sharp(atlasInput)
    .avif({ quality: 58, effort: 5 })
    .toFile(path.join(assetDirectory, 'work-atlas-v1.avif')),
  sharp(atlasInput)
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(assetDirectory, 'work-atlas-v1.webp')),
])

console.log('Optimized images and copied production fonts.')
