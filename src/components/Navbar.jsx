import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import site from '../content/site.json'
import logo from '../assets/brand/howj-logo-white.svg'
import { REGISTER_URL, externalLinkProps } from '../lib/links.js'

// Figma: Navigation/Sticky (node 86:4096) — floating three-segment mint bar
// (logo | links | Register CTA), 96px tall on desktop spanning the full viewport
// width, rounded-md (16px) segments on brand-primary-800, white text. Center
// links collapse into a hamburger dropdown below lg, per the design dev note.
// Bar height reduced 20% from the original spec (48px -> 38.4px mobile,
// 96px -> 76.8px desktop) per request.
const links = (site.nav ?? []).filter((item) => item.path !== '/register')

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="flex items-stretch" aria-label="Primary">
        {/* logo segment */}
        <NavLink
          to="/"
          onClick={close}
          className="flex h-[38.4px] shrink-0 items-center justify-center rounded-md bg-brand-primary-800 px-5 lg:h-[76.8px] lg:w-[205px] lg:px-0"
        >
          <img src={logo} alt="HOWJ — Hang Out With Jesus" className="h-[26px] w-auto lg:h-[38px]" />
        </NavLink>

        {/* center links segment (desktop only) */}
        <ul className="hidden flex-1 items-center justify-end gap-10 rounded-md bg-brand-primary-800 px-12 font-heading text-xl text-neutral-white lg:flex xl:gap-12 xl:px-16">
          {links.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `whitespace-nowrap transition hover:opacity-60 ${isActive ? 'font-semibold' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Register CTA segment (holds the hamburger on mobile; Register itself
            moves into the mobile dropdown below lg, per request) */}
        <div className="flex h-[38.4px] flex-1 items-center justify-between rounded-md bg-brand-primary-800 px-6 lg:h-[76.8px] lg:w-[180px] lg:flex-none lg:justify-center lg:px-0">
          <a
            href={REGISTER_URL}
            {...externalLinkProps}
            onClick={close}
            className="hidden font-heading text-xl font-semibold text-neutral-white transition hover:opacity-60 lg:block"
          >
            Register
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="ml-auto text-neutral-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-7 w-7" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      {open && (
        <ul
          id="mobile-nav"
          className="mt-2 flex flex-col gap-1 rounded-md bg-brand-primary-800 p-4 font-heading text-xl text-neutral-white lg:hidden"
        >
          {links.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={close}
                className={({ isActive }) =>
                  `block rounded-sm px-4 py-3 transition hover:bg-neutral-white/10 ${isActive ? 'font-semibold' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href={REGISTER_URL}
              {...externalLinkProps}
              onClick={close}
              className="block rounded-sm px-4 py-3 font-semibold transition hover:bg-neutral-white/10"
            >
              Register
            </a>
          </li>
        </ul>
      )}
    </header>
  )
}
