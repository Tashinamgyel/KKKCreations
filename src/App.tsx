import {
  type CSSProperties,
  type FormEvent,
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

type GalleryItem = {
  title: string
  category: string
  detail: string
  position: string
}

type ClientReview = {
  name: string
  comment: string
  rating: number
}

type BookingField = 'name' | 'email' | 'phone'
type BookingErrors = Partial<Record<BookingField, string>>

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

const clientReviews: ClientReview[] = [
  {
    name: 'Sonam D.',
    comment: 'The jacket feels precise without feeling stiff. Every detail was discussed, and the finished fit feels completely natural.',
    rating: 5,
  },
  {
    name: 'Pema C.',
    comment: 'I brought a saved reference and chose the cloth in the studio. KKKCreations translated the idea beautifully while making it work for me.',
    rating: 5,
  },
  {
    name: 'Karma W.',
    comment: 'Thoughtful fittings, careful finishing and clear advice throughout. The final piece is one I will keep reaching for.',
    rating: 4,
  },
]

const socialPlatforms = [
  { name: 'Instagram', platform: 'instagram' },
  { name: 'Facebook', platform: 'facebook' },
  { name: 'TikTok', platform: 'tiktok' },
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

function ReviewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      setRating(5)
      setSubmitted(false)
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <dialog
      ref={dialogRef}
      className="review-dialog"
      aria-labelledby="review-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="review-dialog-panel">
        <button
          className="review-dialog-close"
          type="button"
          aria-label="Close review form"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>

        {submitted ? (
          <div className="review-confirmation" aria-live="polite">
            <p className="eyebrow">Review received</p>
            <h2 id="review-dialog-title">Thank you for sharing.</h2>
            <p>
              This prototype confirms the submission without publishing it. Saving and
              moderation will be connected when the backend is ready.
            </p>
            <button className="button button--brown" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            <p className="eyebrow">Your experience, in your words</p>
            <h2 id="review-dialog-title">Leave a review.</h2>

            <label className="review-field">
              <span>Your name</span>
              <input name="reviewerName" autoComplete="name" required />
            </label>

            <label className="review-field">
              <span>Your review</span>
              <textarea
                name="review"
                placeholder="Tell us about your garment and fitting experience…"
                maxLength={600}
                required
              />
            </label>

            <fieldset className="review-rating-control">
              <legend>Rating</legend>
              <div className="rating-options">
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <span className={`rating-option${value === 0 ? ' rating-option--zero' : ''}`} key={value}>
                    <input
                      id={`review-rating-${value}`}
                      type="radio"
                      name="rating"
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                    />
                    <label
                      className={value > 0 && value <= rating ? 'is-selected' : ''}
                      htmlFor={`review-rating-${value}`}
                    >
                      <span aria-hidden="true">{value === 0 ? '0' : '★'}</span>
                      <span className="visually-hidden">{value} out of 5 stars</span>
                    </label>
                  </span>
                ))}
              </div>
              <p aria-live="polite">{rating} out of 5 stars</p>
            </fieldset>

            <button className="button button--brown" type="submit">
              Submit review
            </button>
            <p className="review-form-note">
              Preview form only. Reviews will be saved once the backend is connected.
            </p>
          </form>
        )}
      </div>
    </dialog>
  )
}

function Header({ light = false }: { light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
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
            <Link to="/#offers" onClick={() => setMenuOpen(false)}>Offers</Link>
            <Link to="/#contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <button
              className="nav-review-trigger"
              type="button"
              onClick={() => {
                setMenuOpen(false)
                setReviewOpen(true)
              }}
            >
              Leave a review
            </button>
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
      <ReviewDialog open={reviewOpen} onClose={() => setReviewOpen(false)} />
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
        <span>Made in Thimphu</span>
      </div>
      <picture className="hero-picture">
        <source
          type="image/avif"
          srcSet="/assets/kkk-hero-v1-768.avif 768w, /assets/kkk-hero-v1-1280.avif 1280w, /assets/kkk-hero-v1-1672.avif 1672w"
          sizes="100vw"
        />
        <source
          type="image/webp"
          srcSet="/assets/kkk-hero-v1-768.webp 768w, /assets/kkk-hero-v1-1280.webp 1280w, /assets/kkk-hero-v1-1672.webp 1672w"
          sizes="100vw"
        />
        <img
          className="hero-image"
          src="/assets/kkk-hero.png"
          alt="Woman wearing a made-to-measure black jacket against a warm brown background"
          width="1672"
          height="941"
          sizes="100vw"
          decoding="async"
          {...{ fetchpriority: 'high' }}
        />
      </picture>
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
  const [errors, setErrors] = useState<BookingErrors>({})

  function clearError(field: BookingField) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors

      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const nameInput = form.elements.namedItem('name') as HTMLInputElement | null
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null
    const phoneInput = form.elements.namedItem('phone') as HTMLInputElement | null
    const nextErrors: BookingErrors = {}

    if (!nameInput?.value.trim()) nextErrors.name = 'Enter your name.'

    if (!emailInput?.value.trim()) {
      nextErrors.email = 'Enter your email address.'
    } else if (emailInput.validity.typeMismatch) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!phoneInput?.value.trim()) nextErrors.phone = 'Enter your phone number.'

    setErrors(nextErrors)

    const firstInvalidField = (['name', 'email', 'phone'] as BookingField[])
      .find((field) => nextErrors[field])

    if (firstInvalidField) {
      setSubmitted(false)
      const invalidInput = form.elements.namedItem(firstInvalidField) as HTMLInputElement | null
      invalidInput?.focus()
      return
    }

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
            <p><a href="tel:17123456">17123456</a></p>
          </div>
        </div>

        <form className="booking-form" noValidate onSubmit={handleSubmit}>
          <div className="field-row field-row--contact">
            <label>
              <span>Your name</span>
              <input
                name="name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'booking-name-error' : undefined}
                onInput={() => clearError('name')}
                required
              />
              {errors.name ? (
                <small className="field-error" id="booking-name-error" aria-live="polite">
                  {errors.name}
                </small>
              ) : null}
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                spellCheck={false}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'booking-email-error' : undefined}
                onInput={() => clearError('email')}
                required
              />
              {errors.email ? (
                <small className="field-error" id="booking-email-error" aria-live="polite">
                  {errors.email}
                </small>
              ) : null}
            </label>
            <label>
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
                onInput={() => clearError('phone')}
                required
              />
              {errors.phone ? (
                <small className="field-error" id="booking-phone-error" aria-live="polite">
                  {errors.phone}
                </small>
              ) : null}
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

function Reviews() {
  const reviewTrackRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState({ canGoBack: false, canGoForward: true })

  useEffect(() => {
    const track = reviewTrackRef.current
    if (!track) return

    const updateScrollState = () => {
      const maximumScroll = track.scrollWidth - track.clientWidth
      const nextState = {
        canGoBack: track.scrollLeft > 4,
        canGoForward: track.scrollLeft < maximumScroll - 4,
      }

      setScrollState((currentState) => (
        currentState.canGoBack === nextState.canGoBack &&
        currentState.canGoForward === nextState.canGoForward
          ? currentState
          : nextState
      ))
    }

    updateScrollState()
    track.addEventListener('scroll', updateScrollState, { passive: true })

    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(track)

    return () => {
      track.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [])

  function scrollReviews(direction: -1 | 1) {
    const track = reviewTrackRef.current
    const firstReview = track?.querySelector<HTMLElement>('.review-entry')
    if (!track || !firstReview) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    track.scrollBy({
      left: direction * (firstReview.getBoundingClientRect().width + gap),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <section className="reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="reviews-layout page-shell">
        <div className="reviews-heading">
          <p className="eyebrow">Client notes · Preview</p>
          <h2 id="reviews-title">Made for one. Remembered warmly.</h2>
          <p>
            A first look at how client feedback will appear. Verified reviews will replace these
            sample entries when the studio backend is connected.
          </p>
        </div>

        <div className="reviews-rail">
          <div className="reviews-toolbar">
            <p id="reviews-instructions">
              {clientReviews.length} client notes · Swipe, scroll or use the arrows
            </p>
            <div className="reviews-controls" aria-label="Review navigation">
              <button
                className="review-nav-button review-nav-button--previous"
                type="button"
                aria-label="Previous review"
                disabled={!scrollState.canGoBack}
                onClick={() => scrollReviews(-1)}
              >
                <ArrowIcon />
              </button>
              <button
                className="review-nav-button"
                type="button"
                aria-label="Next review"
                disabled={!scrollState.canGoForward}
                onClick={() => scrollReviews(1)}
              >
                <ArrowIcon />
              </button>
            </div>
          </div>

          <div
            ref={reviewTrackRef}
            className="reviews-list"
            role="region"
            aria-label="Client reviews"
            aria-describedby="reviews-instructions"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

              event.preventDefault()
              scrollReviews(event.key === 'ArrowLeft' ? -1 : 1)
            }}
          >
            {clientReviews.map((review) => (
              <article className="review-entry" key={review.name}>
                <p className="review-author">{review.name}</p>
                <blockquote>
                  <p>“{review.comment}”</p>
                </blockquote>
                <p className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
                  <span aria-hidden="true">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                  <span>{review.rating}/5</span>
                </p>
              </article>
            ))}
          </div>
        </div>
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
                <span
                  className="footer-social-placeholder"
                  role="listitem"
                  title={`${social.name} link to be supplied`}
                  key={social.name}
                >
                  <SocialIcon platform={social.platform} />
                  <span className="visually-hidden">{social.name} link to be supplied</span>
                </span>
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
          </div>
          <div>
            <span>Visit</span>
            <Link to="/#appointment">Book a fitting</Link>
            <a href="mailto:hello@kkkcreations.bt">Contact the studio</a>
            <a href="tel:17123456">17123456</a>
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
      <Reviews />
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
