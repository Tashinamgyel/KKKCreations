import { copyFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const assetDirectory = path.resolve('public/assets')
const clientAssetDirectory = path.join(assetDirectory, 'client')
const clientPhotoDirectory = path.resolve('client photos')

await mkdir(assetDirectory, { recursive: true })
// This directory contains build derivatives only; clear it so removed sources cannot ship stale.
await rm(clientAssetDirectory, { recursive: true, force: true })
await mkdir(clientAssetDirectory, { recursive: true })

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

const clientPhotos = [
  ['F1362CB6-22D9-4CD5-8B3B-C20FF93EE752.png', 'earth-tone-portrait'],
  ['FBD9B7FC-74C6-4CFE-A111-7E5F4196D5D4.png', 'earth-tone-profile'],
  ['IMG_7340.jpeg', 'fur-collar-wrap'],
  ['IMG_7357.jpeg', 'heritage-trim-jacket'],
  ['att.UkqQPCvb9E-QHzaYZzFLHQ9_hs3f7mzvwpyLeKUuiDM.jpeg', 'bronze-tailored-jacket'],
  ['bag.jpeg', 'bag'],
  ['dress-1.png', 'dress-1'],
  ['dress-2.jpeg', 'dress-2'],
  ['dress-3.png', 'dress-3'],
  ['dress-4.png', 'dress-4'],
  ['dress-5.jpeg', 'dress-5'],
  ['group-dress-4.jpeg', 'group-dress-4'],
  ['jacket-1.png', 'jacket-1'],
  ['jacket-2.png', 'jacket-2'],
  ['jacket-3.png', 'jacket-3'],
  ['jacket-4-studio.png', 'jacket-4'],
  ['jacket-with-creator-kinley-dema.jpeg', 'kinley-dema'],
  ['kkkcreations-label-retouched.png', 'label-detail'],
  ['shirt-1.png', 'shirt-1'],
  ['tego-1.jpeg', 'tego-1'],
]
const clientWidths = [480, 960, 1600]

await Promise.all(clientPhotos.map(async ([source, name]) => {
  const input = path.join(clientPhotoDirectory, source)
  const { width: sourceWidth } = await sharp(input).metadata()
  const widths = clientWidths.filter((width, index) => (
    index === 0 || !sourceWidth || clientWidths[index - 1] < sourceWidth
  ))

  await Promise.all(widths.flatMap((width) => [
    sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 62, effort: 5 })
      .toFile(path.join(clientAssetDirectory, `${name}-${width}.avif`)),
    sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(clientAssetDirectory, `${name}-${width}.webp`)),
  ]))
}))

console.log(`Optimized ${clientPhotos.length} client photographs and copied production fonts.`)
