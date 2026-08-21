import {
  type CSSProperties,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
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

type GalleryItem = {
  title: string
  category: string
  detail: string
  position: string
}

const galleryItems: GalleryItem[] = [
  {
    title: 'Cacao wool jacket',
    category: 'Jackets',
    detail: 'Soft shoulder · two button',
    position: '0% 0%',
  },
  {
    title: 'Ivory three-piece',
    category: 'Suits',
    detail: 'Peak lapel · tonal buttons',
    position: '50% 0%',
  },
  {
    title: 'Hand-finished lapel',
    category: 'Details',
    detail: 'Horn button · pick stitching',
    position: '100% 0%',
  },
  {
    title: 'Tobacco cropped jacket',
    category: 'Jackets',
    detail: 'Standing collar · sculpted waist',
    position: '0% 100%',
  },
  {
    title: 'Crisp cotton shirt',
    category: 'Shirts',
    detail: 'Cutaway collar · French cuff',
    position: '50% 100%',
  },
  {
    title: 'The final hand stitch',
    category: 'Process',
    detail: 'Finished by hand in Thimphu',
    position: '100% 100%',
  },
]

const collectionCopy = {
  men: {
    eyebrow: 'Made for him',
    title: 'The men’s collection',
    copy: 'Suits, jackets, shirts and trousers cut for your proportions—not a standard size. Start with one of our house silhouettes or bring a reference of your own.',
    categories: ['All', 'Jackets', 'Suits', 'Shirts', 'Details'],
  },
  women: {
    eyebrow: 'Made for her',
    title: 'The women’s collection',
    copy: 'Sharp tailoring, quiet structure and a fit resolved around you. Choose a KKKCreations design or arrive with your own idea and preferred cloth.',
    categories: ['All', 'Jackets', 'Suits', 'Shirts', 'Details'],
  },
}

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

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
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
  const transitionTo = useRouteTransition()

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
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
          <Link to="/#offers" onClick={() => setMenuOpen(false)}>Offers</Link>
          <Link to="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <Link className="header-appointment" to="/#appointment">
          Book a fitting <ArrowIcon />
        </Link>

        <button
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
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Header light />
      <div className="measure-rail" aria-hidden="true">
        <span>01</span>
        <i />
        <span>Made in Thimphu</span>
      </div>
      <img
        className="hero-image"
        src="/assets/kkk-hero.png"
        alt="Woman wearing a made-to-measure black jacket against a warm brown background"
        width="1680"
        height="945"
        {...{ fetchpriority: 'high' }}
      />
      <div className="hero-shade" aria-hidden="true" />
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
          <span className="collection-number">For her</span>
          <span className="collection-name">Women</span>
          <span className="collection-action">View the collection <ArrowIcon /></span>
        </Link>
      </div>
    </section>
  )
}

function Appointment() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="appointment" id="appointment" aria-labelledby="appointment-title">
      <div className="appointment-visual">
        <div className="sketch-caption">
          <span>Pattern 01</span>
          <span>Cut for one</span>
        </div>
        <img
          src="/assets/fashion-sketch.svg"
          alt="Fashion designer's line sketch of a tailored jacket with measurement notes"
          width="760"
          height="900"
          loading="lazy"
        />
      </div>

      <div className="appointment-content">
        <p className="eyebrow eyebrow--light">A fitting, not a transaction</p>
        <h2 id="appointment-title">Let’s shape your idea.</h2>
        <p className="appointment-lede">
          Bring a sketch, a saved reference or simply a need. We will talk through proportion,
          fabric and finish, then take your measurements in the studio.
        </p>

        <div className="contact-ledger" id="contact">
          <div>
            <span>Studio</span>
            <p>Thimphu, Bhutan</p>
          </div>
          <div>
            <span>Hours</span>
            <p>Monday–Saturday · By appointment</p>
          </div>
          <div>
            <span>Contact</span>
            <p><a href="mailto:hello@kkkcreations.bt">hello@kkkcreations.bt</a></p>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label>
              <span>Your name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                required
              />
            </label>
          </div>
          <div className="field-row">
            <label>
              <span>I’m interested in</span>
              <select name="garment" defaultValue="Jacket" autoComplete="off">
                <option>Jacket</option>
                <option>Suit</option>
                <option>Shirt</option>
                <option>Trousers</option>
                <option>Something else</option>
              </select>
            </label>
            <label>
              <span>Preferred date</span>
              <input type="date" name="date" autoComplete="off" />
            </label>
          </div>
          <button className="button button--sand" type="submit">Request a fitting</button>
          <p className="form-note" role="status" aria-live="polite">
            {submitted
              ? 'Request saved for this prototype. Connect the final booking service before launch.'
              : 'We will confirm your appointment and studio directions personally.'}
          </p>
        </form>
      </div>
    </section>
  )
}

function WorkCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <article className={`work-card work-card--${index + 1}`}>
      <div
        className="atlas-image"
        style={{ backgroundPosition: item.position } as CSSProperties}
        role="img"
        aria-label={item.title}
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
          Cloth, proportion and finish are resolved together. This prototype uses editorial
          placeholders until the studio’s own archive is supplied.
        </p>
      </div>

      <div className="work-grid">
        {galleryItems.map((item, index) => (
          <WorkCard item={item} index={index} key={item.title} />
        ))}
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
        <p className="eyebrow">Awards &amp; acclaim</p>
        <h2 id="recognition-title">Recognition, properly credited.</h2>
        <p>
          This section is ready for the studio’s verified awards, press and professional
          associations. Placeholder labels keep the prototype accurate for now.
        </p>
      </div>
      <div className="recognition-list">
        {['Award or honour', 'Press feature', 'Professional acclaim'].map((title) => (
          <article key={title}>
            <span>To be supplied</span>
            <h3>{title}</h3>
            <p>Institution or publication · Year</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main page-shell">
        <div>
          <Link className="wordmark wordmark--footer" to="/" translate="no">
            <span>KKK</span>Creations
          </Link>
          <p>Bespoke tailoring, made in Bhutan.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Collections</span>
            <Link to="/collections/men">Men</Link>
            <Link to="/collections/women">Women</Link>
            <Link to="/#work">Selected work</Link>
          </div>
          <div>
            <span>Visit</span>
            <Link to="/#appointment">Book a fitting</Link>
            <a href="mailto:hello@kkkcreations.bt">Contact the studio</a>
            <span className="footer-address">Thimphu, Bhutan</span>
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

function CollectionPage({ audience }: { audience: 'men' | 'women' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const copy = collectionCopy[audience]
  const requestedCategory = searchParams.get('category')
  const activeCategory = requestedCategory && copy.categories.includes(requestedCategory)
    ? requestedCategory
    : 'All'
  const visibleItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory)

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
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div id="main-content">
        <ScrollManager />
        <div className="route-stage" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections/men" element={<CollectionPage audience="men" />} />
            <Route path="/collections/women" element={<CollectionPage audience="women" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  )
}
