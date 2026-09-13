import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import Appointment from './components/Appointment'
import { SeoMetadata } from './seo'

type GalleryItem = {
  title: string
  category: string
  detail: string
  photo: Photo
  position?: string
}

type Photo = {
  name: string
  alt: string
  width: number
  height: number
}

const photos = {
  dress1: { name: 'dress-1', alt: 'Model wearing a floor-length earth-toned dress with Bhutanese textile details', width: 941, height: 1672 },
  dress2: { name: 'dress-2', alt: 'Model walking a fashion runway in a red and ivory KKKCreations look', width: 1639, height: 2048 },
  dress3: { name: 'dress-3', alt: 'Woman wearing a structured cobalt dress with a matching textile handbag', width: 941, height: 1672 },
  dress4: { name: 'dress-4', alt: 'Two women wearing contemporary Bhutanese ensembles in blue and brown', width: 941, height: 1672 },
  dress5: { name: 'dress-5', alt: 'Olive wrap dress displayed on a tailor’s form', width: 810, height: 1080 },
  group: { name: 'group-dress-4', alt: 'Four women wearing coordinated KKKCreations designs on stone steps in Bhutan', width: 8640, height: 5760 },
  jacket1: { name: 'jacket-1', alt: 'Long navy tailored jacket with embroidered sleeves on a tailor’s form', width: 1087, height: 1447 },
  jacket2: { name: 'jacket-2', alt: 'Black jacket with vivid Bhutanese geometric textile panels', width: 941, height: 1672 },
  jacket3: { name: 'jacket-3', alt: 'Man wearing a black velvet jacket with white botanical embroidery', width: 941, height: 1672 },
  jacket4: { name: 'jacket-4', alt: 'Woman wearing a deep wine velvet jacket with traditional patterned cuffs', width: 1920, height: 2560 },
  kinley: { name: 'kinley-dema', alt: 'KKKCreations co-founder Kinley Dema adjusting a patterned jacket in the boutique', width: 941, height: 1337 },
  label: { name: 'label-detail', alt: 'Hands holding the butterfly KKKCreations label against black striped cloth', width: 1672, height: 941 },
  shirt: { name: 'shirt-1', alt: 'Man wearing a fitted blue Bhutanese-patterned shirt', width: 941, height: 1672 },
  tego: { name: 'tego-1', alt: 'Rose-pink contemporary tego displayed on a tailor’s form', width: 941, height: 1672 },
} satisfies Record<string, Photo>

const selectedWork: GalleryItem[] = [
  {
    title: 'Ethereal earth tones',
    category: 'Occasion dress',
    detail: 'Sculpted layers · textile accents',
    photo: photos.dress1,
    position: '50% 34%',
  },
  {
    title: 'Botanical velvet jacket',
    category: 'Menswear',
    detail: 'Contrast embroidery · relaxed line',
    photo: photos.jacket3,
    position: '50% 28%',
  },
  {
    title: 'The maker’s mark',
    category: 'Finishing detail',
    detail: 'A final signature, sewn by hand',
    photo: photos.label,
    position: '52% 50%',
  },
  {
    title: 'A modern Bhutanese line',
    category: 'Runway',
    detail: 'Crimson weave · asymmetric drape',
    photo: photos.dress2,
    position: '50% 24%',
  },
  {
    title: 'Pattern in full colour',
    category: 'Tailored jacket',
    detail: 'Geometric cloth · clean structure',
    photo: photos.jacket2,
    position: '50% 28%',
  },
  {
    title: 'A softer tradition',
    category: 'Contemporary tego',
    detail: 'Rose cloth · elongated proportion',
    photo: photos.tego,
    position: '50% 34%',
  },
]

const collectionItems: Record<'men' | 'women', GalleryItem[]> = {
  men: [
    { title: 'Midnight brocade coat', category: 'Jackets', detail: 'Long line · embroidered sleeve', photo: photos.jacket1, position: '50% 32%' },
    { title: 'Geometric tailored jacket', category: 'Jackets', detail: 'Bhutanese textile · clean structure', photo: photos.jacket2, position: '50% 30%' },
    { title: 'Botanical velvet jacket', category: 'Jackets', detail: 'Contrast embroidery · relaxed line', photo: photos.jacket3, position: '50% 28%' },
    { title: 'Wine velvet jacket', category: 'Jackets', detail: 'Traditional cuff · soft tailoring', photo: photos.jacket4, position: '50% 24%' },
    { title: 'Indigo patterned shirt', category: 'Shirts', detail: 'Close fit · Bhutanese weave', photo: photos.shirt, position: '50% 30%' },
  ],
  women: [
    { title: 'Ethereal earth tones', category: 'Dresses', detail: 'Sculpted layers · textile accents', photo: photos.dress1, position: '50% 34%' },
    { title: 'Runway in crimson', category: 'Runway', detail: 'Asymmetric drape · ivory base', photo: photos.dress2, position: '50% 22%' },
    { title: 'Cobalt structure', category: 'Dresses', detail: 'Tailored shape · matching handbag', photo: photos.dress3, position: '50% 26%' },
    { title: 'Two ways with tradition', category: 'Traditional', detail: 'Layered textiles · contemporary proportion', photo: photos.dress4, position: '50% 32%' },
    { title: 'Olive wrap dress', category: 'Dresses', detail: 'Double-breasted wrap · belted waist', photo: photos.dress5, position: '50% 44%' },
    { title: 'Rose contemporary tego', category: 'Traditional', detail: 'Elongated line · minimal finish', photo: photos.tego, position: '50% 34%' },
  ],
}

const collectionCopy = {
  men: {
    eyebrow: 'Made for him',
    title: 'The men’s collection',
    copy: 'Suits, jackets, shirts and trousers cut for your proportions—not a standard size. Start with one of our house silhouettes or bring a reference of your own.',
    categories: ['All', 'Jackets', 'Shirts'],
  },
  women: {
    eyebrow: 'Made for her',
    title: 'The women’s collection',
    copy: 'Sharp tailoring, quiet structure and a fit resolved around you. Choose a KKKCreations design or arrive with your own idea and preferred cloth.',
    categories: ['All', 'Dresses', 'Traditional', 'Runway'],
  },
}

const socialPlatforms = [
  { name: 'Instagram', platform: 'instagram', href: 'https://www.instagram.com/kkkcreations2025/?hl=en' },
  { name: 'Facebook', platform: 'facebook', href: 'https://www.facebook.com/profile.php?id=61580623720628' },
  { name: 'TikTok', platform: 'tiktok', href: 'https://www.tiktok.com/@kkk_creations5?_r=1&_t=ZS-99h3ORSypHg' },
] as const

const ROUTE_LEAVE_MS = 180
const ROUTE_ENTER_MS = 420

function useRouteTransition() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (to: string, event: ReactMouseEvent<HTMLAnchorElement>) => {
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasNativeViewTransitions = 'startViewTransition' in document

    if (
      pathname === to ||
      event.button !== 0 ||
      isModifiedClick ||
      event.currentTarget.target === '_blank' ||
      prefersReducedMotion ||
      hasNativeViewTransitions
    ) {
      return
    }

    event.preventDefault()

    const root = document.documentElement
    if (root.classList.contains('route-is-leaving')) return

    root.classList.add('route-is-leaving')

    window.setTimeout(() => {
      navigate(to)
      root.classList.remove('route-is-leaving')
      root.classList.add('route-is-entering')

      window.setTimeout(() => {
        root.classList.remove('route-is-entering')
      }, ROUTE_ENTER_MS)
    }, ROUTE_LEAVE_MS)
  }
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 16">
      <path d="M1 8h28M23 1l7 7-7 7" />
    </svg>
  )
}

function Mark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 96 96" fill="none">
      <path d="M48 5 91 48 48 91 5 48 48 5Z" />
      <path d="M48 18 78 48 48 78 18 48 48 18Z" />
      <path d="M48 31 65 48 48 65 31 48 48 31Z" />
    </svg>
  )
}

function ClientPhoto({
  photo,
  className,
  sizes = '(max-width: 860px) 100vw, 50vw',
  position,
  eager = false,
}: {
  photo: Photo
  className?: string
  sizes?: string
  position?: string
  eager?: boolean
}) {
  const srcSet = (format: 'avif' | 'webp') => {
    const seenWidths = new Set<number>()
    return [480, 960, 1600]
      .map((requestedWidth) => ({ requestedWidth, actualWidth: Math.min(requestedWidth, photo.width) }))
      .filter(({ actualWidth }) => {
        if (seenWidths.has(actualWidth)) return false
        seenWidths.add(actualWidth)
        return true
      })
      .map(({ requestedWidth, actualWidth }) => (
        `/assets/client/${photo.name}-${requestedWidth}.${format} ${actualWidth}w`
      ))
      .join(', ')
  }

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={`/assets/client/${photo.name}-960.webp`}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...{ fetchpriority: eager ? 'high' : 'auto' }}
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  )
}

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth'
        document.querySelector(hash)?.scrollIntoView({ behavior })
      } else {
        window.scrollTo({ top: 0 })
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

function Header({ light = false }: { light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigationRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const transitionTo = useRouteTransition()

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    const closeOnOutsidePress = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (navigationRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return

      setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsidePress)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsidePress)
    }
  }, [menuOpen])

  return (
    <>
      <header className={`site-header${light ? ' site-header--light' : ''}`}>
        <div className="header-inner">
          <Link
            className="wordmark"
            to="/"
            aria-label="KKKCreations home"
            translate="no"
            viewTransition
          >
            <span>KKK</span>Creations
          </Link>

          <nav
            ref={navigationRef}
            id="main-navigation"
            className={`main-nav${menuOpen ? ' main-nav--open' : ''}`}
            aria-label="Main navigation"
          >
            <Link
              to="/collections/men"
              viewTransition
              onClick={(event) => {
                setMenuOpen(false)
                transitionTo('/collections/men', event)
              }}
            >
              Men
            </Link>
            <Link
              to="/collections/women"
              viewTransition
              onClick={(event) => {
                setMenuOpen(false)
                transitionTo('/collections/women', event)
              }}
            >
              Women
            </Link>
            <Link to="/#work" onClick={() => setMenuOpen(false)}>Our work</Link>
            <Link
              to="/artists"
              viewTransition
              onClick={(event) => {
                setMenuOpen(false)
                transitionTo('/artists', event)
              }}
            >
              Our artists
            </Link>
            <Link to="/#offers" onClick={() => setMenuOpen(false)}>Offers</Link>
            <Link to="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </nav>

          <Link className="header-appointment" to="/#appointment">
            Book a fitting <ArrowIcon />
          </Link>

          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Header light />
      <div className="measure-rail" aria-hidden="true">
        <span>01</span>
        <i />
        <span>Made in Paro</span>
      </div>
      <ClientPhoto
        photo={photos.group}
        className="hero-picture"
        sizes="(max-width: 860px) 100vw, 54vw"
        position="50% 44%"
        eager
      />
      <div className="hero-content page-shell">
        <p className="eyebrow eyebrow--light">Bespoke tailoring · Bhutan</p>
        <h1 id="hero-title">
          Made to your measure.
          <em>Made to be yours.</em>
        </h1>
        <p className="hero-intro">
          Choose a house design or bring your own. We cut every piece to your measurements,
          in the fabric you want.
        </p>
        <div className="hero-actions">
          <Link className="button button--ivory" to="/#appointment">Book an appointment</Link>
          <Link className="text-link text-link--light" to="/#collections">
            Explore collections <ArrowIcon />
          </Link>
        </div>
      </div>
      <p className="hero-note">One pattern. One person. No compromise.</p>
    </section>
  )
}

function Collections() {
  const transitionTo = useRouteTransition()

  return (
    <section className="collections" id="collections" aria-labelledby="collections-title">
      <div className="section-heading page-shell">
        <div>
          <p className="eyebrow">Begin with a silhouette</p>
          <h2 id="collections-title">Tailored for the life you lead.</h2>
        </div>
        <p>
          Every style is a starting point. Adjust the cut, cloth, details and finish until it is
          unmistakably yours.
        </p>
      </div>

      <div className="collection-pair">
        <Link
          className="collection-card collection-card--men"
          to="/collections/men"
          viewTransition
          onClick={(event) => transitionTo('/collections/men', event)}
        >
          <ClientPhoto photo={photos.jacket3} className="collection-photo" position="50% 28%" />
          <span className="collection-number">For him</span>
          <span className="collection-name">Men</span>
          <span className="collection-action">View the collection <ArrowIcon /></span>
        </Link>
        <Link
          className="collection-card collection-card--women"
          to="/collections/women"
          viewTransition
          onClick={(event) => transitionTo('/collections/women', event)}
        >
          <ClientPhoto photo={photos.dress1} className="collection-photo" position="50% 34%" />
          <span className="collection-number">For her</span>
          <span className="collection-name">Women</span>
          <span className="collection-action">View the collection <ArrowIcon /></span>
        </Link>
      </div>
    </section>
  )
}

function WorkCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <article className={`work-card work-card--${index + 1}`}>
      <ClientPhoto
        photo={item.photo}
        className="work-image"
        sizes="(max-width: 620px) 100vw, (max-width: 860px) 50vw, 33vw"
        position={item.position}
      />
      <div className="work-card-copy">
        <span>{item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.detail}</p>
      </div>
    </article>
  )
}

function SelectedWork() {
  return (
    <section className="work page-shell" id="work" aria-labelledby="work-title">
      <div className="section-heading section-heading--work">
        <div>
          <p className="eyebrow">Selected commissions</p>
          <h2 id="work-title">Details that reward a closer look.</h2>
        </div>
        <p>
          Cloth, proportion and finish are resolved together. Every photograph here comes from
          the KKKCreations studio and its own collection archive.
        </p>
      </div>

      <div className="work-grid">
        {selectedWork.map((item, index) => (
          <WorkCard item={item} index={index} key={item.title} />
        ))}
      </div>
    </section>
  )
}

function Artists() {
  return (
    <section className="artists" id="artists" aria-labelledby="artists-title">
      <div className="artists-inner page-shell">
        <div className="artists-heading">
          <p className="eyebrow">The artists behind the work</p>
          <h2 id="artists-title">A family craft, carried forward by 2 sisters.</h2>
          <p className="artists-intro">
            Thinley Wangmo and Kinley Dema founded KKKCreations as a tribute to their father,
            Kado, a respected dressmaker whose patience, generosity and eye for cloth shaped
            their creative lives.
          </p>
        </div>

        <figure className="artist-portrait">
          <ClientPhoto photo={photos.kinley} sizes="(max-width: 860px) 100vw, 42vw" position="50% 40%" />
          <figcaption>Kinley Dema at the KKKCreations boutique</figcaption>
        </figure>

        <div className="artists-story">
          <div className="artist-names" aria-label="KKKCreations founders">
            <p><span>01</span>Thinley Wangmo</p>
            <p><span>02</span>Kinley Dema</p>
          </div>
          <p>
            Thinley leads the boutique in Paro while Kinley brings perspective from Australia.
            Their work pairs modern minimalism with Bhutanese textiles, symbolic pattern and
            the natural colours of home.
          </p>
          <p>
            The studio’s 2025 Bhutan Fashion Week collection, <em>Ethereal Harmony</em>, explored
            that meeting point between contemporary form and cultural memory.
          </p>
          <a
            className="text-link"
            href="https://bhutanfashionweek.com/thinley-wangmo-and-kinley-dema/"
            target="_blank"
            rel="noreferrer"
          >
            Read the designer profile <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  )
}

function Offers() {
  const offers = [
    {
      label: 'Wardrobe offer',
      title: 'Order two shirts, receive a third.',
      copy: 'Build a working rotation in three fabrics, cut from one perfected pattern.',
    },
    {
      label: 'First fitting',
      title: 'Complimentary design consultation.',
      copy: 'A 30-minute fabric and silhouette consultation for first-time clients.',
    },
    {
      label: 'Occasion dressing',
      title: 'Tailoring for the whole party.',
      copy: 'Preferential pricing for three or more coordinated occasion looks.',
    },
  ]

  return (
    <section className="offers" id="offers" aria-labelledby="offers-title">
      <div className="offers-intro page-shell">
        <p className="eyebrow eyebrow--light">Studio offers · Preview</p>
        <h2 id="offers-title">More reason to make it personal.</h2>
        <p>Temporary offer concepts. Final pricing and terms will be confirmed by KKKCreations.</p>
      </div>
      <div className="offer-list page-shell">
        {offers.map((offer, index) => (
          <article className="offer" key={offer.title}>
            <span className="offer-index">0{index + 1}</span>
            <p className="offer-label">{offer.label}</p>
            <h3>{offer.title}</h3>
            <p>{offer.copy}</p>
            <Link to="/#appointment" className="text-link text-link--light">
              Ask at your fitting <ArrowIcon />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

function Recognition() {
  return (
    <section className="recognition page-shell" aria-labelledby="recognition-title">
      <div className="recognition-title-wrap">
        <Mark />
        <p className="eyebrow">Runway &amp; recognition</p>
        <h2 id="recognition-title">On the runway, rooted at home.</h2>
        <p>
          KKKCreations presented <em>Ethereal Harmony</em> at Bhutan Fashion Week 2025—a collection
          shaped by the serene spirit of Bhutan and the dialogue between heritage and modernity.
        </p>
      </div>
      <div className="recognition-list">
        <a
          className="recognition-feature"
          href="https://bhutanfashionweek.com/thinley-wangmo-and-kinley-dema/"
          target="_blank"
          rel="noreferrer"
        >
          <span>Designer profile</span>
          <h3>Bhutan Fashion Week</h3>
          <p>October 2025</p>
          <span className="recognition-arrow" aria-hidden="true"><ArrowIcon /></span>
        </a>
        <figure className="recognition-image">
          <ClientPhoto photo={photos.dress2} sizes="(max-width: 860px) 100vw, 38vw" position="50% 50%" />
          <figcaption>Ethereal Harmony · Bhutan Fashion Week 2025</figcaption>
        </figure>
      </div>
    </section>
  )
}

function SocialIcon({ platform }: { platform: 'instagram' | 'facebook' | 'tiktok' }) {
  if (platform === 'instagram') {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle className="social-icon-dot" cx="17.4" cy="6.7" r="1" />
      </svg>
    )
  }

  if (platform === 'facebook') {
    return (
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
        <path
          className="social-icon-fill"
          d="M13.6 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.5 1.6-1.5H17V4c-.3 0-1.4-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V10H7.5v3h2.8v8h3.3Z"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M14.5 4v11.1a4.6 4.6 0 1 1-3.4-4.4v3.2a1.6 1.6 0 1 0 .4 1.2V4h3Z" />
      <path d="M14.5 4c.4 2.2 1.7 3.6 4 4.1v3.1a7.4 7.4 0 0 1-4-1.2" />
    </svg>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main page-shell">
        <div className="footer-brand">
          <Link className="wordmark wordmark--footer" to="/" translate="no">
            <span>KKK</span>Creations
          </Link>
          <p>Bespoke tailoring, made in Bhutan.</p>
          <div className="footer-socials">
            <span className="footer-socials-label">Social</span>
            <div className="footer-social-icons" role="list" aria-label="Social media handles">
              {socialPlatforms.map((social) => (
                <a
                  className="footer-social-link"
                  role="listitem"
                  href={social.href}
                  aria-label={`KKKCreations on ${social.name}`}
                  target="_blank"
                  rel="noreferrer"
                  key={social.name}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <span>Collections</span>
            <Link to="/collections/men">Men</Link>
            <Link to="/collections/women">Women</Link>
            <Link to="/#work">Selected work</Link>
            <Link to="/artists">Our artists</Link>
          </div>
          <div>
            <span>Visit</span>
            <Link to="/#appointment">Book a fitting</Link>
            <Link to="/#appointment">Contact the studio</Link>
            <span className="footer-address">Paro town, Bhutan</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom page-shell">
        <span>© {new Date().getFullYear()} KKKCreations</span>
        <span>Made carefully, worn often.</span>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <main>
      <Hero />
      <Collections />
      <Appointment />
      <SelectedWork />
      <Offers />
      <Recognition />
      <Footer />
    </main>
  )
}

function ArtistsPage() {
  return (
    <main className="artists-page">
      <Header />
      <Artists />
      <Footer />
    </main>
  )
}

function CollectionPage({ audience }: { audience: 'men' | 'women' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const copy = collectionCopy[audience]
  const items = collectionItems[audience]
  const requestedCategory = searchParams.get('category')
  const activeCategory = requestedCategory && copy.categories.includes(requestedCategory)
    ? requestedCategory
    : 'All'
  const visibleItems = activeCategory === 'All'
    ? items
    : items.filter((item) => item.category === activeCategory)

  return (
    <main className="collection-page">
      <Header />
      <section className="collection-hero page-shell">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
        </div>
        <div>
          <p>{copy.copy}</p>
          <Link className="button button--brown" to="/#appointment">Book a fitting</Link>
        </div>
      </section>

      <section className="collection-catalogue page-shell" aria-label={`${audience} garments`}>
        <div className="catalogue-toolbar">
          <p>{visibleItems.length} pieces</p>
          <div className="filter-list" aria-label="Filter garments">
            {copy.categories.map((category) => (
              <button
                type="button"
                className={activeCategory === category ? 'is-active' : ''}
                aria-pressed={activeCategory === category}
                onClick={() => {
                  setSearchParams(category === 'All' ? {} : { category })
                }}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="catalogue-grid">
          {visibleItems.map((item, index) => (
            <WorkCard item={item} index={index} key={`${audience}-${item.title}`} />
          ))}
        </div>
      </section>

      <section className="collection-cta">
        <div className="page-shell">
          <p className="eyebrow eyebrow--light">Have another design in mind?</p>
          <h2>Bring the reference. Choose the cloth. We’ll make it fit.</h2>
          <Link className="button button--ivory" to="/#appointment">Start your commission</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}

function NotFound() {
  return (
    <main className="not-found">
      <Header />
      <div>
        <p className="eyebrow">404 · Off pattern</p>
        <h1>This page needs a new cut.</h1>
        <Link className="button button--brown" to="/">Return home</Link>
      </div>
    </main>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <SeoMetadata />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div id="main-content" tabIndex={-1}>
        <ScrollManager />
        <div className="route-stage" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/men" element={<CollectionPage audience="men" />} />
            <Route path="/collections/women" element={<CollectionPage audience="women" />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  )
}
