import { useState } from 'react'
import Reveal from './Reveal.jsx'
import HeroBackground from './HeroBackground.jsx'
import BoardingPassCard from './BoardingPassCard.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import SocialLinks from './SocialLinks.jsx'
import upcoming from '../content/upcoming.json'

// Boarding pass + marquee content for the next scheduled revival — computed
// at build time in scripts/fetch-expressions.mjs (soonest future-dated
// Published row in HOWJ Global). `undefined` per field falls back to each
// component's own hardcoded Jamaica defaults when nothing is upcoming yet;
// `flag` gets a neutral placeholder instead, since falling through to the
// Jamaica flag specifically would be misleading once a real destination is set.
const boardingPassProps = upcoming
  ? {
      titlePhrases: upcoming.titlePhrases?.length ? upcoming.titlePhrases : undefined,
      airportCode: upcoming.airportCode || undefined,
      location: upcoming.location || undefined,
      dateLabel: upcoming.dateLabel || undefined,
      targetDate: upcoming.targetDate || undefined,
      flag: upcoming.flag || '🌍',
    }
  : {}

export default function Hero() {
  const [passVisible, setPassVisible] = useState(true)

  return (
    <section>
      {/* Negative top margin pulls the video under the sticky navbar so it runs
          edge-to-edge behind it; offsets match the navbar's height + top padding
          (navbar is 38.4px mobile / 76.8px desktop after the 20% height cut). */}
      <div className="relative -mt-[50.4px] sm:-mt-[54.4px] lg:-mt-[92.8px]">
        <HeroBackground />
        <div className="relative mx-auto flex min-h-svh max-w-7xl items-center px-6 pb-2xl pt-[84px] sm:pt-[88px] lg:px-2xl lg:pt-[136px]">
          {passVisible && (
            <Reveal>
              <BoardingPassCard {...boardingPassProps} onClose={() => setPassVisible(false)} />
            </Reveal>
          )}
        </div>

        {/* Social row — desktop only, bottom-center over the background. */}
        <SocialLinks className="absolute inset-x-0 bottom-2xl hidden justify-center lg:flex" />
      </div>
      <MarqueeBanner text={upcoming?.marqueeText || undefined} />
    </section>
  )
}
