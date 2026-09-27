import { type FormEvent, useEffect, useRef, useState } from 'react'

type BookingField = 'customerName' | 'email' | 'phone' | 'location' | 'garmentInterest' | 'preferredDate'
type BookingErrors = Partial<Record<BookingField, string>>
type BookingStatus = 'idle' | 'sending' | 'sent' | 'error'

const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN?.trim()
const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim()

const bookingFields: BookingField[] = ['customerName', 'email', 'phone', 'location', 'garmentInterest', 'preferredDate']
const studioLocations = [
  { value: 'paro-bhutan', label: 'Paro, Bhutan' },
  { value: 'act-canberra', label: 'ACT, Canberra' },
]
const garmentOptions = [
  { value: 'jacket', label: 'Jacket' },
  { value: 'suit', label: 'Suit' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'trousers', label: 'Trousers' },
  { value: 'dress', label: 'Dress' },
  { value: 'gho', label: 'Gho' },
  { value: 'kira', label: 'Kira' },
  { value: 'tego', label: 'Tego' },
  { value: 'made-to-measure-tops', label: 'Made-to-measure tops' },
  { value: 'own-design', label: 'My own design' },
]

function todayInBhutan() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Thimphu', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date())
  const part = (type: string) => parts.find((value) => value.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

function telegramMessage(payload: {
  customerName: string
  email: string
  phone: string
  location: string
  garmentInterest: string
  preferredDate: string | null
}) {
  const garment = garmentOptions.find((option) => option.value === payload.garmentInterest)?.label
    ?? payload.garmentInterest
  const location = studioLocations.find((option) => option.value === payload.location)?.label
    ?? payload.location
  const reference = `FIT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const received = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Thimphu',
  }).format(new Date())

  return [
    'KCreations — fitting request',
    '',
    `Reference: ${reference}`,
    `Name: ${payload.customerName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Location: ${location}`,
    `Interested in: ${garment}`,
    `Preferred date: ${payload.preferredDate ?? 'Flexible — please arrange directly'}`,
    '',
    `Received: ${received} (Bhutan)`,
    '',
    'Please contact the customer by email or phone to agree on a fitting. This is a request, not a confirmed appointment.',
  ].join('\n')
}

function FieldError({ field, errors }: { field: BookingField; errors: BookingErrors }) {
  return errors[field] ? (
    <small className="field-error" id={`booking-${field}-error`}>{errors[field]}</small>
  ) : null
}

export default function Appointment() {
  const [status, setStatus] = useState<BookingStatus>('idle')
  const [errors, setErrors] = useState<BookingErrors>({})
  const [submissionError, setSubmissionError] = useState('')
  const requestRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => () => {
    requestRef.current?.abort()
    window.clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    if (status === 'sent') confirmationRef.current?.focus()
  }, [status])

  function clearError(field: BookingField) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) return currentErrors
      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  function showFieldErrors(nextErrors: BookingErrors) {
    setErrors(nextErrors)
    const firstInvalidField = bookingFields.find((field) => nextErrors[field])
    if (firstInvalidField) {
      window.requestAnimationFrame(() => {
        const input = formRef.current?.elements.namedItem(firstInvalidField)
        if (input instanceof HTMLElement) input.focus()
      })
    }
    return Boolean(firstInvalidField)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (requestRef.current) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const value = (field: string) => String(formData.get(field) ?? '').trim()
    const payload = {
      customerName: value('customerName'),
      email: value('email'),
      phone: value('phone'),
      location: value('location'),
      garmentInterest: value('garmentInterest'),
      preferredDate: value('preferredDate') || null,
      website: value('website'),
    }
    const nextErrors: BookingErrors = {}
    const emailInput = form.elements.namedItem('email') as HTMLInputElement

    if (!payload.customerName) nextErrors.customerName = 'Enter your name.'
    if (!payload.email) nextErrors.email = 'Enter your email address.'
    else if (emailInput.validity.typeMismatch) nextErrors.email = 'Enter a valid email address.'
    if (!payload.phone) nextErrors.phone = 'Enter your phone number.'
    else if (!/^\+?[\d\s().-]+$/.test(payload.phone) || !/^\d{7,15}$/.test(payload.phone.replace(/\D/g, ''))) {
      nextErrors.phone = 'Enter a valid phone number, including your country code if outside Bhutan.'
    }
    if (!studioLocations.some((option) => option.value === payload.location)) {
      nextErrors.location = 'Choose the studio location you want to visit.'
    }
    if (!garmentOptions.some((option) => option.value === payload.garmentInterest)) {
      nextErrors.garmentInterest = 'Choose the garment you are interested in.'
    }
    if (payload.preferredDate && payload.preferredDate < todayInBhutan()) {
      nextErrors.preferredDate = 'Choose today or a future date.'
    }

    setSubmissionError('')
    if (showFieldErrors(nextErrors)) {
      setStatus('error')
      return
    }

    if (!telegramBotToken || !telegramChatId) {
      setStatus('error')
      setSubmissionError('Online booking is not configured yet. Please contact the studio by phone or email.')
      return
    }

    const controller = new AbortController()
    requestRef.current = controller
    timeoutRef.current = window.setTimeout(() => controller.abort(), 20_000)
    setStatus('sending')

    try {
      const telegramBody = new URLSearchParams({
        chat_id: telegramChatId,
        text: telegramMessage(payload),
        protect_content: 'true',
      })
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: telegramBody,
        signal: controller.signal,
      })
      form.reset()
      setStatus('sent')
    } catch {
      if (requestRef.current !== controller) return
      setStatus('error')
      setSubmissionError('We couldn’t confirm delivery. Please check your connection or contact the studio before sending again, to avoid a duplicate request.')
    } finally {
      window.clearTimeout(timeoutRef.current)
      if (requestRef.current === controller) requestRef.current = null
    }
  }

  return (
    <section className="appointment" id="appointment" aria-labelledby="appointment-title">
      <div className="appointment-visual">
        <div className="sketch-caption"><span>Figure study</span><span>Measured for one</span></div>
        <img
          src="/assets/fashion-sketch.svg?v=3"
          alt="Minimal human figure outline with tailoring measurement guides"
          width="760" height="900" loading="lazy"
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
          <div><span>Studio</span><p>Paro, Bhutan</p></div>
          <div><span>Hours</span><p>Monday–Saturday · By appointment</p></div>
          <div>
            <span>Booking</span>
            <p>Request below</p>
            <p>We reply by email or phone</p>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="booking-confirmation" ref={confirmationRef} tabIndex={-1} role="status">
            <p className="eyebrow eyebrow--light">Request sent</p>
            <h3>We look forward to meeting you.</h3>
            <p>Your request was sent to the studio’s Telegram. We’ll contact you by email or phone to confirm your fitting and share the directions.</p>
            <button className="text-link text-link--light" type="button" onClick={() => setStatus('idle')}>
              Request another fitting
            </button>
          </div>
        ) : (
          <form className="booking-form" ref={formRef} noValidate onSubmit={handleSubmit} aria-busy={status === 'sending'}>
            <p className="booking-required-note">Your name, contact details, studio location and garment interest are required.</p>
            <fieldset className="booking-fields" disabled={status === 'sending'}>
              <legend className="visually-hidden">Your fitting request</legend>
              <div className="booking-honeypot" aria-hidden="true">
                <label htmlFor="booking-website">Leave this field empty</label>
                <input id="booking-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="field-row field-row--contact">
                <div className="booking-field">
                  <label htmlFor="booking-name">Your name</label>
                  <input id="booking-name" name="customerName" autoComplete="name" maxLength={120}
                    aria-invalid={Boolean(errors.customerName)} aria-describedby={errors.customerName ? 'booking-customerName-error' : undefined}
                    onInput={() => clearError('customerName')} required />
                  <FieldError field="customerName" errors={errors} />
                </div>
                <div className="booking-field">
                  <label htmlFor="booking-email">Email</label>
                  <input id="booking-email" type="email" name="email" autoComplete="email" spellCheck={false} maxLength={254}
                    aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'booking-email-error' : undefined}
                    onInput={() => clearError('email')} required />
                  <FieldError field="email" errors={errors} />
                </div>
                <div className="booking-field">
                  <label htmlFor="booking-phone">Phone</label>
                  <input id="booking-phone" type="tel" name="phone" inputMode="tel" autoComplete="tel" maxLength={32}
                    aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
                    onInput={() => clearError('phone')} required />
                  <FieldError field="phone" errors={errors} />
                </div>
              </div>
              <div className="field-row field-row--details">
                <div className="booking-field">
                  <label htmlFor="booking-location">Preferred studio</label>
                  <select id="booking-location" name="location" defaultValue="" autoComplete="off"
                    aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'booking-location-error' : undefined}
                    onChange={() => clearError('location')} required>
                    <option value="" disabled>Choose a location</option>
                    {studioLocations.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <FieldError field="location" errors={errors} />
                </div>
                <div className="booking-field">
                  <label htmlFor="booking-garment">I’m interested in</label>
                  <select id="booking-garment" name="garmentInterest" defaultValue="" autoComplete="off"
                    aria-invalid={Boolean(errors.garmentInterest)} aria-describedby={errors.garmentInterest ? 'booking-garmentInterest-error' : undefined}
                    onChange={() => clearError('garmentInterest')} required>
                    <option value="" disabled>Choose a garment</option>
                    {garmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <FieldError field="garmentInterest" errors={errors} />
                </div>
                <div className="booking-field">
                  <label htmlFor="booking-date">Preferred date <span className="field-optional">(optional)</span></label>
                  <input id="booking-date" type="date" name="preferredDate" autoComplete="off" min={todayInBhutan()}
                    aria-invalid={Boolean(errors.preferredDate)} aria-describedby={errors.preferredDate ? 'booking-preferredDate-error' : undefined}
                    onInput={() => clearError('preferredDate')} />
                  <FieldError field="preferredDate" errors={errors} />
                </div>
              </div>
              <button className="button button--sand" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? <span className="booking-spinner" aria-hidden="true" /> : null}
                {status === 'sending' ? 'Sending request…' : 'Request a fitting'}
              </button>
            </fieldset>
            <div aria-live="polite" aria-atomic="true">
              {submissionError ? <p className="form-note form-note--error">{submissionError}</p> : null}
              {status === 'error' && !submissionError ? <p className="form-note form-note--error">Please check the highlighted details.</p> : null}
              {status === 'sending' ? <p className="form-note">Sending your request to the studio…</p> : null}
            </div>
            <p className="form-note">We’ll contact you by email or phone to confirm your appointment. Sending a request does not reserve a time.</p>
          </form>
        )}
      </div>
    </section>
  )
}
