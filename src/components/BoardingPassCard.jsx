import { Fragment, useEffect, useState } from 'react'
import PlaneIcon from './PlaneIcon.jsx'
import { REGISTER_URL, externalLinkProps } from '../lib/links.js'

const MS_DAY = 86_400_000
const MS_HOUR = 3_600_000
const MS_MIN = 60_000

function useCountdown(targetDate) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, new Date(targetDate).getTime() - now)
  return {
    days: Math.floor(diff / MS_DAY),
    hours: Math.floor((diff % MS_DAY) / MS_HOUR),
    mins: Math.floor((diff % MS_HOUR) / MS_MIN),
    secs: Math.floor((diff % MS_MIN) / 1000),
  }
}

function JamaicaFlagIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <rect width="60" height="40" fill="#000000" />
      <path d="M0 0h60L30 20Z" fill="#009b3a" />
      <path d="M0 40h60L30 20Z" fill="#009b3a" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#fed100" strokeWidth="8" fill="none" />
    </svg>
  )
}

function CalendarIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9.5h18M8 3v4M16 3v4" />
      <g fill="currentColor" stroke="none">
        {[7.2, 10.4, 13.6, 16.8].map((x) => (
          <g key={x}>
            <circle cx={x} cy="13.5" r="1" />
            <circle cx={x} cy="17.2" r="1" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function BoardingPassCard({
  titlePhrases = ['NEXT STOP', 'JAMAICA', 'HOWJ JAMAICA'],
  airportCode = 'MBJ',
  location = 'MONTEGO BAY, JAMAICA',
  dateLabel = '12 DECEMBER, 2026',
  targetDate = '2026-12-12T00:00:00',
  // Unicode flag emoji for the destination (derived build-time from the
  // expression's Country Code in Notion — see scripts/fetch-expressions.mjs).
  // Falls back to the Jamaica SVG only when nothing dynamic was passed at all.
  flag,
  // Dismiss handler for the top-right close button; button only renders when
  // a handler is passed (Hero.jsx owns the shown/hidden state).
  onClose,
}) {
  const { days, hours, mins, secs } = useCountdown(targetDate)

  // Title loops through the phrases; re-keying the <p> per phrase replays the
  // title-swap-in animation (keyframes in index.css) on every swap.
  const [phraseIndex, setPhraseIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setPhraseIndex((i) => (i + 1) % titlePhrases.length), 2600)
    return () => clearInterval(id)
  }, [titlePhrases.length])
  const units = [
    [days, 'DAYS'],
    [String(hours).padStart(2, '0'), 'HOURS'],
    [String(mins).padStart(2, '0'), 'MINUTES'],
    [String(secs).padStart(2, '0'), 'SECONDS'],
  ]

  // max-w-[22.4rem] not max-w-*: the custom --spacing-* tokens shadow the container scale.
  // px-lg on the body/countdown is the shared content inset — route icons, countdown
  // numbers, and labels all sit flush to it (the "red line" alignment from the reference).
  return (
    <div className="relative flex w-full max-w-[22.4rem] flex-col bg-brand-primary-900 p-sm">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="absolute -right-3 -top-3 z-10 flex size-8 items-center justify-center rounded-full border border-neutral-gray-300 bg-neutral-white text-brand-primary-900 shadow-md transition hover:scale-105"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="size-3.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      )}

      {/* Ticket stub — dashed border is the boarding-pass perforation, plane sits on it */}
      <div className="relative">
        <div className="flex items-center justify-center rounded-t-sm border-b-[3px] border-dashed border-neutral-gray-500 bg-neutral-white px-md py-md">
          <p
            key={titlePhrases[phraseIndex]}
            className="title-swap-in font-heading text-4xl font-bold text-brand-primary-900 sm:text-[2.75rem]"
          >
            {titlePhrases[phraseIndex]}
          </p>
        </div>
        {/* outer span keeps the positioning transform; inner icon animates its own */}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <PlaneIcon className="plane-fly-in w-16 text-brand-secondary" />
        </span>
      </div>

      {/* Ticket body */}
      <div className="flex flex-col items-center bg-neutral-white px-lg pb-md pt-sm">
        {/* leading-[1] not leading-none: --spacing-none shadows it to line-height 0 */}
        <p className="font-heading text-[9.4rem] font-bold leading-[1] text-brand-primary-900">
          {airportCode}
        </p>

        <div className="mt-sm flex w-full items-center">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-primary-700 text-neutral-black">
            <PlaneIcon className="w-7" />
          </span>
          <span className="h-0 flex-1 border-t-2 border-neutral-gray-700" />
          {flag ? (
            <span
              role="img"
              aria-label="Destination flag"
              className="flex h-9 w-13 shrink-0 items-center justify-center rounded-[4px] bg-neutral-gray-100 text-3xl leading-none"
            >
              {flag}
            </span>
          ) : (
            <JamaicaFlagIcon className="h-9 w-13 shrink-0 rounded-[4px]" />
          )}
        </div>

        <p className="mt-sm font-condensed text-lg tracking-wide text-text-muted">{location}</p>
        <div className="mt-xs flex items-center gap-xs">
          <CalendarIcon className="size-6 shrink-0 text-text-muted" />
          <p className="font-condensed text-lg tracking-wide text-text-muted">{dateLabel}</p>
        </div>
      </div>

      {/* Countdown — 216:23:12:20 style, labels under each number, edges on the inset */}
      <div className="flex w-full items-start justify-between rounded-b-sm bg-brand-secondary px-lg py-md text-brand-secondary-700">
        {units.map(([value, label], i) => (
          <Fragment key={label}>
            <div className="flex flex-col items-start">
              <p className="font-heading text-[2.5rem] font-bold leading-[1]">{value}</p>
              <p className="mt-1 text-2xs font-bold tracking-wider">{label}</p>
            </div>
            {i < units.length - 1 && (
              <p className="font-heading text-[2.5rem] font-bold leading-[1]">:</p>
            )}
          </Fragment>
        ))}
      </div>

      <a
        href={REGISTER_URL}
        {...externalLinkProps}
        className="mt-sm flex items-center justify-center rounded-sm bg-brand-secondary py-3 font-heading text-2xl font-bold text-neutral-black transition hover:brightness-95 sm:text-3xl"
      >
        REGISTER
      </a>
    </div>
  )
}
