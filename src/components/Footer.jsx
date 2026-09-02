import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/brand/howj-logo-grey.svg'
import { socialLinks } from '../lib/social.js'

const columns = [
  {
    heading: 'Explore',
    links: [
      { label: 'Articles', href: '#' },
      { label: 'Gifts', href: '#' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Volunteering', href: '#' },
      { label: 'Privacy', href: '#' },
    ],
  },
  {
    heading: 'Social',
    links: socialLinks.map(({ label, href }) => ({ label, href })),
  },
]

const linkClass = 'text-neutral-gray-300 transition hover:text-neutral-white'

function FooterLink({ link }) {
  if (link.to) {
    return (
      <Link to={link.to} className={linkClass}>
        {link.label}
      </Link>
    )
  }
  const external = link.href?.startsWith('http')
  return (
    <a
      href={link.href}
      className={linkClass}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {link.label}
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Not wired to a backend yet — shows a local confirmation on submit.
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="bg-black text-neutral-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-2xl px-6 pb-2xl pt-3xl sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
        {/* newsletter column */}
        <div>
          <img src={logo} alt="Hang Out With Jesus" className="mb-xl h-16 w-auto" />

          <h2 className="font-heading text-3xl font-bold">Join the inner circle.</h2>
          <p className="mt-4 max-w-[18rem] text-lg leading-snug text-neutral-gray-500">
            Get updates on our next mission, charity events and testimonies
          </p>

          {submitted ? (
            <p className="mt-6 text-neutral-gray-300">Thanks — you’re on the list. ✦</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 max-w-[20rem]">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border-b border-neutral-gray-500 bg-neutral-white px-4 py-3 text-neutral-black placeholder:text-neutral-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
              />
              <p className="mt-4 text-[0.7rem] leading-relaxed text-neutral-gray-500">
                I agree to receive marketing emails about Hang Out With Jesus events and related
                updates.
              </p>
              <p className="mt-2 text-[0.7rem] leading-relaxed text-neutral-gray-500">
                By clicking “Submit”, and sharing your email, you agree to our{' '}
                <a href="#" className="underline hover:text-neutral-white">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-neutral-white">
                  Privacy Policy
                </a>
                .
              </p>
              <button
                type="submit"
                className="mt-6 rounded-full bg-brand-primary-700 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-white transition hover:brightness-110"
              >
                Submit
              </button>
            </form>
          )}
        </div>

        {/* link columns */}
        {columns.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="font-heading text-2xl font-bold">{col.heading}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {col.links.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* contact column */}
        <div>
          <h2 className="font-heading text-2xl font-bold">Contact Us</h2>
          <div className="mt-6 flex flex-col gap-4 text-neutral-gray-300">
            <a href="mailto:info@howjglobal.org" className="transition hover:text-neutral-white">
              info@howjglobal.org
            </a>
            <p className="leading-relaxed">
              146 West 29th Street,
              <br />
              New York, NY10001
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-8 text-xs text-neutral-gray-500">
        © {year} Hang Out With Jesus. All rights reserved.
      </div>
    </footer>
  )
}
