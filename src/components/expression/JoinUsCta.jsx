import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import jamaica from '../../assets/hero/montegobay.png'
import { REGISTER_URL, externalLinkProps } from '../../lib/links.js'

const TITLE = 'Join us in Jamaica'

// Closing call-to-action (Figma 203:4414): the Jamaica host destination with a
// big yellow Register button over a bright photo. The title is split per
// character and waves in a continuous loop.
export default function JoinUsCta() {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const chars = el.querySelectorAll('[data-char]')
    // staggered yoyo = a wave running across the letters, forever
    const tween = gsap.to(chars, {
      yPercent: -22,
      duration: 0.9,
      ease: 'sine.inOut',
      stagger: { each: 0.07, repeat: -1, yoyo: true },
    })
    return () => tween.kill()
  }, [])

  const words = TITLE.split(' ')

  return (
    <section className="relative flex min-h-[44rem] items-center justify-center overflow-hidden py-[10rem] lg:min-h-[52rem] lg:py-[13rem]">
      <img src={jamaica} alt="" className="absolute inset-0 size-full object-cover" />
      {/* light scrim only — the design keeps the photo bright */}
      <div className="absolute inset-0 bg-neutral-black/20" aria-hidden="true" />

      <div className="relative flex flex-col items-center gap-lg px-6 text-center">
        {/* data-split keeps the page-level reveal off this heading — it animates itself */}
        <h2
          ref={titleRef}
          data-split
          className="font-condensed text-6xl font-bold uppercase leading-[1] text-neutral-white sm:text-7xl lg:whitespace-nowrap lg:text-8xl"
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-block">
              {word.split('').map((ch, ci) => (
                <span key={ci} data-char className="inline-block">
                  {ch}
                </span>
              ))}
              {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
            </span>
          ))}
        </h2>
        <a
          href={REGISTER_URL}
          {...externalLinkProps}
          className="flex h-[5.5rem] w-full max-w-[26rem] items-center justify-center rounded-sm bg-brand-secondary font-body text-3xl font-bold uppercase text-neutral-black transition hover:brightness-95 sm:text-4xl"
        >
          Register
        </a>
      </div>
    </section>
  )
}
