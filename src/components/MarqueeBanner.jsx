import PlaneIcon from './PlaneIcon.jsx'
import { REGISTER_URL, externalLinkProps } from '../lib/links.js'

function MarqueeItem({ text }) {
  return (
    <div className="flex items-center gap-xl pr-xl sm:gap-2xl sm:pr-2xl">
      <p className="whitespace-nowrap font-heading text-lg font-bold uppercase text-neutral-white sm:text-2xl">
        {text}
      </p>
      <PlaneIcon className="w-12 shrink-0 text-brand-secondary sm:w-16" />
      <a
        href={REGISTER_URL}
        {...externalLinkProps}
        className="flex shrink-0 items-center justify-center rounded-sm bg-brand-secondary px-xl py-1 font-heading text-lg text-neutral-black transition hover:brightness-95 sm:px-2xl sm:py-1.5 sm:text-xl"
      >
        REGISTER
      </a>
    </div>
  )
}

// Infinite right-to-left scroll, pure CSS (keyframes in index.css), pauses on hover.
// The track holds two identical halves so translateX(-50%) loops seamlessly; each
// half repeats the item enough times to cover ultrawide viewports.
export default function MarqueeBanner({ text = 'HANG OUT WITH JESUS JAMAICA MONTEGO BAY' }) {
  return (
    <div className="marquee bg-brand-primary-900 py-xs sm:py-sm">
      <div className="marquee-track">
        {[false, true].map((clone) => (
          <div key={clone ? 'clone' : 'original'} className="flex" aria-hidden={clone || undefined}>
            {[0, 1, 2].map((i) => (
              <MarqueeItem key={i} text={text} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
