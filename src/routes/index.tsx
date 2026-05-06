import { useEffect, useState } from 'react'

// ─── Logo / Wordmark ────────────────────────────────────────────────────────

function Logo({ inverted = false }: { inverted?: boolean }) {
  const text = inverted ? '#fafaf9' : '#1c1917'
  const accent = '#a3e635'
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Walk the Work"
    >
      {/* path underline accent */}
      <rect x="0" y="34" width="36" height="3" fill={accent} rx="1.5" />
      {/* wordmark */}
      <text
        x="0"
        y="24"
        fontFamily="DM Serif Display, Georgia, serif"
        fontSize="22"
        fill={text}
        letterSpacing="-0.3"
      >
        Walk the Work
      </text>
    </svg>
  )
}

// ─── Utility ────────────────────────────────────────────────────────────────

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/daniel@danielbloomberg.com'

// ─── Inquiry Form ───────────────────────────────────────────────────────────

const INTEREST_OPTIONS = [
  { id: 'book-1-1', label: 'Booking a 1:1 walk' },
  { id: 'question-first', label: 'Asking a question first' },
  { id: 'group-walk', label: 'Future small group walk' },
  { id: 'cohort', label: 'Future cohort or programme' },
  { id: 'not-sure', label: 'Not sure yet' },
]

function InquiryForm() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    location: '',
    decision: '',
    tried: '',
    clarity: '',
  })
  const [interests, setInterests] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!submitted) {
      return
    }

    const bookingSection = document.getElementById('book')
    if (!bookingSection) {
      return
    }

    window.history.replaceState(null, '', '#book')
    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [submitted])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields({ ...fields, [e.target.name]: e.target.value })

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: encode({
          _subject: 'Walk The Work Enquiry',
          _template: 'table',
          _captcha: 'false',
          ...fields,
          interests: interests.join(', '),
        }),
      })
      if (!response.ok) {
        throw new Error('Submission failed')
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email daniel@danielbloomberg.com directly.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 md:p-12 text-center">
        <p className="text-lg leading-relaxed" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Thank you. Daniel will read this and respond if Walk the Work seems like a useful fit.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-900 placeholder-stone-400 text-sm focus:border-transparent transition-colors'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* honeypot */}
      <div style={{ display: 'none' }}>
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass} htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={fields.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="location">Where are you based?</label>
        <input
          id="location"
          type="text"
          name="location"
          value={fields.location}
          onChange={handleChange}
          placeholder="City or region"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="decision">What decision or crossroads are you carrying?</label>
        <textarea
          id="decision"
          name="decision"
          value={fields.decision}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe the decision or crossroads as clearly as you can right now."
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="tried">What have you already tried — research, advice, AI, conversations, lists?</label>
        <textarea
          id="tried"
          name="tried"
          value={fields.tried}
          onChange={handleChange}
          rows={3}
          placeholder="What approaches haven't resolved it?"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="clarity">What would you like to be clearer by the end of a walk?</label>
        <textarea
          id="clarity"
          name="clarity"
          value={fields.clarity}
          onChange={handleChange}
          rows={3}
          placeholder="What does a useful outcome look like for you?"
          className={inputClass}
        />
      </div>

      <div>
        <p className={labelClass}>Are you interested in:</p>
        <div className="space-y-3">
          {INTEREST_OPTIONS.map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <span
                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  interests.includes(opt.id)
                    ? 'bg-stone-900 border-stone-900'
                    : 'border-stone-300 group-hover:border-stone-500'
                }`}
                onClick={() => toggleInterest(opt.id)}
              >
                {interests.includes(opt.id) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-stone-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full sm:w-auto bg-stone-900 text-stone-50 px-8 py-4 rounded-lg text-sm font-semibold tracking-wide hover:bg-stone-800 active:bg-stone-950 transition-colors cursor-pointer"
      >
        Send Enquiry
      </button>
    </form>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function WalkTheWork() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9', color: '#1c1917' }}>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-500">
            <a href="#what-it-is" className="hover:text-stone-900 transition-colors">What it is</a>
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it works</a>
            <a href="#about" className="hover:text-stone-900 transition-colors">About Daniel</a>
          </div>
          <a
            href="#book"
            className="hidden md:inline-flex items-center bg-stone-900 text-stone-50 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide hover:bg-stone-800 transition-colors"
          >
            Book a Walk
          </a>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(open => !open)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-stone-200 bg-white text-stone-900"
          >
            <span className="relative w-5 h-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-stone-50/98 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-stone-600">
              <a
                href="#what-it-is"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                What it is
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                About Daniel
              </a>
              <a
                href="#book"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center bg-stone-900 text-stone-50 px-5 py-3 rounded-xl text-xs tracking-wide hover:bg-stone-800 transition-colors"
              >
                Book a Walk
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl">
            {/* eyebrow */}
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-8">
              Hampstead Heath · London
            </p>

            {/* headline */}
            <h1
              className="text-6xl sm:text-7xl md:text-8xl leading-none mb-8"
              style={{ fontFamily: 'DM Serif Display, serif', letterSpacing: '-0.02em' }}
            >
              Walk the
              <br />
              <span style={{ color: '#1c1917', position: 'relative', display: 'inline-block' }}>
                Work
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: '100%',
                    height: '6px',
                    background: '#a3e635',
                    borderRadius: '3px',
                  }}
                />
              </span>
            </h1>

            {/* subheadline */}
            <p
              className="text-2xl md:text-3xl text-stone-700 mb-6 leading-snug"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              For decisions that need a walk,<br className="hidden sm:block" /> not another search.
            </p>

            {/* supporting copy */}
            <p className="text-lg text-stone-600 mb-10 max-w-xl leading-relaxed">
              A 90-minute walking conversation for people at a crossroads — when more research, advice, AI output, and comparison are no longer helping.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="#book"
                className="inline-flex items-center bg-stone-900 text-stone-50 px-8 py-4 rounded-lg font-semibold text-sm tracking-wide hover:bg-stone-800 active:bg-stone-950 transition-colors"
              >
                Book a Walk
              </a>
              <a
                href="#book"
                className="inline-flex items-center text-stone-700 border border-stone-300 px-8 py-4 rounded-lg font-semibold text-sm tracking-wide hover:border-stone-500 hover:text-stone-900 transition-colors"
              >
                Make an Enquiry
              </a>
            </div>

            {/* price note */}
            <p className="mt-5 text-sm text-stone-500">
              Introductory first session: £150 for 90 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Hero image band ── */}
      <div className="w-full h-64 md:h-80 overflow-hidden bg-stone-200 relative">
        {/* SVG landscape illustration — Hampstead Heath path */}
        <svg
          viewBox="0 0 1200 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e7e5e4" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </linearGradient>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8a29e" />
              <stop offset="100%" stopColor="#78716c" />
            </linearGradient>
          </defs>
          {/* sky */}
          <rect width="1200" height="320" fill="url(#skyGrad)" />
          {/* distant hills */}
          <path d="M0 200 Q150 140 300 180 Q450 220 600 160 Q750 100 900 180 Q1050 240 1200 190 L1200 320 L0 320Z" fill="#c7c3c0" />
          {/* mid hills */}
          <path d="M0 230 Q200 190 400 220 Q600 250 800 210 Q1000 170 1200 230 L1200 320 L0 320Z" fill="#b5b0ab" />
          {/* ground */}
          <path d="M0 260 Q300 240 600 265 Q900 285 1200 255 L1200 320 L0 320Z" fill="url(#groundGrad)" />
          {/* path — clearly defined dirt track */}
          <path
            d="M480 320 Q500 270 530 240 Q560 210 580 190 Q600 170 620 145"
            stroke="#e7e5e4"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M480 320 Q500 270 530 240 Q560 210 580 190 Q600 170 620 145"
            stroke="#d6d3d1"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* two walking figures */}
          {/* figure 1 */}
          <circle cx="546" cy="218" r="5" fill="#44403c" />
          <line x1="546" y1="223" x2="546" y2="238" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="546" y1="227" x2="540" y2="234" stroke="#44403c" strokeWidth="2" strokeLinecap="round" />
          <line x1="546" y1="227" x2="552" y2="234" stroke="#44403c" strokeWidth="2" strokeLinecap="round" />
          <line x1="546" y1="238" x2="542" y2="247" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="546" y1="238" x2="550" y2="247" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />
          {/* figure 2 */}
          <circle cx="558" cy="224" r="5" fill="#57534e" />
          <line x1="558" y1="229" x2="558" y2="244" stroke="#57534e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="558" y1="233" x2="552" y2="240" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
          <line x1="558" y1="233" x2="564" y2="240" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
          <line x1="558" y1="244" x2="554" y2="253" stroke="#57534e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="558" y1="244" x2="562" y2="253" stroke="#57534e" strokeWidth="2.5" strokeLinecap="round" />
          {/* trees left */}
          <ellipse cx="150" cy="195" rx="50" ry="40" fill="#a8a29e" opacity="0.6" />
          <ellipse cx="200" cy="210" rx="35" ry="30" fill="#92918d" opacity="0.5" />
          {/* trees right */}
          <ellipse cx="1050" cy="190" rx="60" ry="45" fill="#a8a29e" opacity="0.6" />
          <ellipse cx="1000" cy="205" rx="40" ry="35" fill="#92918d" opacity="0.5" />
          {/* accent stripe at bottom */}
          <rect x="0" y="314" width="1200" height="6" fill="#a3e635" opacity="0.7" />
        </svg>
      </div>

      {/* ── Problem section ── */}
      <section id="what-it-is" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h2
              className="text-4xl md:text-5xl mb-8 leading-tight"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              You may not need more information.
            </h2>
            <div className="space-y-5 text-lg text-stone-600 leading-relaxed">
              <p>
                You have read the articles. Asked ChatGPT. Talked to friends. Compared options. Made lists. Maybe even decided — then reopened the decision again.
              </p>
              <p>
                At some point, more input stops creating clarity. It becomes noise.
              </p>
              <p className="text-stone-900 font-medium">
                Walk the Work is for that moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="text-4xl md:text-5xl mb-10 leading-tight"
                style={{ fontFamily: 'DM Serif Display, serif' }}
              >
                For people carrying a live decision.
              </h2>
            </div>
            <div>
              <ul className="space-y-4 mb-10">
                {[
                  'Should I stay where I am or change direction?',
                  'Is it time to go independent?',
                  'Which creative, business, or personal path should I pursue?',
                  'What am I keeping alive for too long?',
                  'What should I stop researching, comparing, or asking the internet?',
                  'What is the next honest step?',
                ].map((q) => (
                  <li key={q} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full mt-0.5 flex items-center justify-center"
                      style={{ background: '#a3e635' }}
                    >
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="4" r="2.5" fill="#1c1917" />
                      </svg>
                    </span>
                    <span className="text-stone-700">{q}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-stone-200 pt-8 space-y-4">
                <p className="text-sm text-stone-600 leading-relaxed">
                  Often useful for professionals, founders, independents, creatives, and people in transition — but the real criterion is not a job title. It is whether there is a decision that needs clearer human judgment.
                </p>
                <p className="text-xs text-stone-400 leading-relaxed">
                  This is a reflective decision conversation, not therapy, diagnosis, crisis support, or professional financial, legal, or career advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-stone-900 text-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="text-4xl md:text-5xl mb-8 leading-tight text-stone-50"
                style={{ fontFamily: 'DM Serif Display, serif' }}
              >
                A structured conversation, held while walking.
              </h2>
              <div className="space-y-4 text-stone-400 leading-relaxed">
                <p>
                  We walk for 90 minutes on Hampstead Heath, without phones. You do not need to arrive with a clean brief. The work is to find the real question underneath the swirl.
                </p>
                <p className="text-stone-300">
                  <span className="font-medium text-stone-100">Meeting point:</span>{' '}
                  The corner across from Hampstead Heath Overground station.
                </p>
                <p className="text-sm text-stone-500 mt-6">
                  Walks are all-weather. Please bring appropriate footwear and clothing.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-6">
                The method
              </p>
              <ol className="space-y-5">
                {[
                  'Name the real question',
                  'Separate signal from noise',
                  'Map the live options',
                  'Notice the pattern underneath',
                  'Choose the next honest experiment',
                  'Make the stop-list',
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#a3e635', color: '#1c1917' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-stone-300 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you leave with ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h2
              className="text-4xl md:text-5xl mb-10 leading-tight"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Less noise.<br />A clearer next move.
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                'A clearer decision frame',
                'Fewer live options',
                'A practical next experiment or action',
                'A stop-list of what to stop researching, comparing, asking, or keeping alive',
                'Better language for what is really at stake',
                'A stronger sense of the path immediately ahead',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-1"
                    style={{ color: '#a3e635' }}
                  >
                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                      <path d="M1 7L6 12L17 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-stone-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-stone-500 italic">
              The walk does not promise certainty. It creates the conditions for clearer judgment.
            </p>
          </div>
        </div>
      </section>

      {/* ── Booking ── */}
      <section id="book" className="py-24 px-6" style={{ background: '#1c1917' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div className="lg:pt-4">
              <h2
                className="text-4xl md:text-5xl mb-6 text-stone-50 leading-tight"
                style={{ fontFamily: 'DM Serif Display, serif' }}
              >
                Book a Walk
              </h2>
              <p className="text-stone-400 text-lg mb-4 max-w-xl">
                Introductory first session: £150 for a 90-minute walking session on Hampstead Heath.
              </p>

              <div className="flex flex-wrap gap-6 mb-8 text-sm text-stone-500">
                <span>📍 Hampstead Heath</span>
                <span>⏱ 90 minutes</span>
                <span>🌦 All-weather</span>
              </div>

              <p className="text-stone-300 leading-relaxed max-w-xl mb-4">
                Use the form to send Daniel the decision you are carrying and any practical context that will help.
              </p>
              <p className="text-stone-400 leading-relaxed max-w-xl">
                After you submit it, Daniel will reply with scheduling options and payment details if Walk the Work seems like a useful fit.
              </p>
            </div>

            <div className="bg-stone-50 rounded-3xl p-8 md:p-10">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bio ── */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* photo */}
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-2xl bg-stone-100 aspect-[3/4] max-w-xs">
                <img
                  src={`${import.meta.env.BASE_URL}daniel-bloomberg.jpg`}
                  alt="Daniel Bloomberg"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            {/* text */}
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
                About
              </p>
              <h2
                className="text-3xl md:text-4xl mb-8 leading-snug"
                style={{ fontFamily: 'DM Serif Display, serif' }}
              >
                Daniel Bloomberg{' '}
                <span
                  className="italic"
                  style={{ color: '#78716c', fontSize: '0.85em' }}
                >
                  // Technology advisor turned decision flâneur
                </span>
              </h2>
              <div className="space-y-5 text-stone-600 leading-relaxed">
                <p>
                  I have spent much of my career helping people and organisations make clearer decisions before they commit serious money, time, teams, or energy to the wrong direction.
                </p>
                <p>
                  As a technology and product advisor, I have worked with businesses facing complex, high-stakes questions: what to build, what to stop, where to focus, and how to move forward without letting noise become momentum.
                </p>
                <p>
                  Walk the Work is the individual version of that practice.
                </p>
                <p>
                  It is for people whose decisions cannot be resolved by another search result, AI prompt, advice thread, or pros-and-cons list. It brings the decision back into conversation, movement, attention, and human judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-6 bg-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <p
            className="text-3xl md:text-4xl mb-8 text-stone-900"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            For decisions that need a walk,<br />not another search.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#book"
              className="inline-flex items-center justify-center bg-stone-900 text-stone-50 px-8 py-4 rounded-lg font-semibold text-sm tracking-wide hover:bg-stone-800 transition-colors"
            >
              Book a Walk — £150
            </a>
            <a
              href="#book"
              className="inline-flex items-center justify-center text-stone-700 border border-stone-300 px-8 py-4 rounded-lg font-semibold text-sm tracking-wide hover:border-stone-500 transition-colors"
            >
              Make an Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 bg-stone-900 text-stone-500 border-t border-stone-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div>
              <Logo inverted />
              <p className="text-sm mt-4 text-stone-500 leading-relaxed max-w-xs">
                For decisions that need a walk, not another search.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-600 mb-4">Navigate</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#what-it-is" className="hover:text-stone-300 transition-colors">What it is</a></li>
                <li><a href="#how-it-works" className="hover:text-stone-300 transition-colors">How it works</a></li>
                <li><a href="#about" className="hover:text-stone-300 transition-colors">About Daniel</a></li>
                <li><a href="#book" className="hover:text-stone-300 transition-colors">Book a Walk</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-600 mb-4">Contact</p>
              <p className="text-sm text-stone-400">Daniel Bloomberg</p>
              <p className="text-sm text-stone-500">London</p>
              <a
                href="mailto:daniel@danielbloomberg.com"
                className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
              >
                daniel@danielbloomberg.com
              </a>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <p className="text-xs text-stone-600">
              © 2025 Walk the Work. All rights reserved.
            </p>
            <p className="text-xs text-stone-700">
              Form responses are used only to respond to your enquiry or booking request.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
