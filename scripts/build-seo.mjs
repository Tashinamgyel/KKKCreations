import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const seo = JSON.parse(await readFile('src/data/seo.json', 'utf8'))
const outputDirectory = path.resolve('dist')
const template = await readFile(path.join(outputDirectory, 'index.html'), 'utf8')
const metadataMarker = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

if (!metadataMarker.test(template)) {
  throw new Error('The built HTML is missing its SEO metadata markers.')
}

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]))

// Do not add sample contact details, awards, offers, or reviews to structured data.
const business = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: seo.siteName,
  url: `${seo.origin}/`,
  description: 'Couture Designs made to measure in Bhutan in the fabric you choose.',
  founder: [
    { '@type': 'Person', name: 'Thinley Wangmo' },
    { '@type': 'Person', name: 'Kinley Dema' },
  ],
  foundingLocation: { '@type': 'Place', name: 'Paro, Bhutan' },
  areaServed: { '@type': 'Country', name: 'Bhutan' },
  subjectOf: {
    '@type': 'Article',
    name: 'Thinley Wangmo and Kinley Dema',
    url: 'https://bhutanfashionweek.com/thinley-wangmo-and-kinley-dema/',
  },
}).replace(/</g, '\\u003c')

function metadataFor(route, page) {
  const url = new URL(route, seo.origin).href
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  return `<!-- seo:start -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${new URL(seo.image, seo.origin).href}" />
    <meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${new URL(seo.image, seo.origin).href}" />
    <meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />
    <script type="application/ld+json">${business}</script>
    <!-- seo:end -->`
}

await Promise.all(Object.entries(seo.pages).map(async ([route, page]) => {
  let html = template.replace(metadataMarker, metadataFor(route, page))
  if (route !== '/') {
    // Only the homepage uses the hero: avoid downloading it on collection visits.
    html = html.replace(/<link\b[^>]*\bas="image"[^>]*>/g, '')
  }
  const destination = route === '/'
    ? path.join(outputDirectory, 'index.html')
    : path.join(outputDirectory, `${route.slice(1)}.html`)
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, html)
}))

// The inline JSON-LD is data, and receives an exact CSP hash rather than enabling inline scripts.
const headersPath = path.join(outputDirectory, '_headers')
const headers = await readFile(headersPath, 'utf8')
const jsonLdHash = createHash('sha256').update(business).digest('base64')
await writeFile(headersPath, headers.replace(
  /script-src 'self'(?: 'sha256-[^']+')?;/,
  `script-src 'self' 'sha256-${jsonLdHash}';`,
))

console.log(`Built SEO metadata for ${Object.keys(seo.pages).length} public routes.`)
