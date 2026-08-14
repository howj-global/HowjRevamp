import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import gsap from 'gsap'
import ExpressionHero from '../components/expression/ExpressionHero.jsx'
import ExpressionOverview from '../components/expression/ExpressionOverview.jsx'
import NumbersBand from '../components/expression/NumbersBand.jsx'
import DocumentarySection from '../components/expression/DocumentarySection.jsx'
import GuestMinisters from '../components/expression/GuestMinisters.jsx'
import CharitySection from '../components/expression/CharitySection.jsx'
import PartnersBar from '../components/expression/PartnersBar.jsx'
import Gallery from '../components/expression/Gallery.jsx'
import JoinUsCta from '../components/expression/JoinUsCta.jsx'
import expressions from '../content/expressions.json'
import { expressionMock } from '../content/expressionMock.js'

// scroll-mt keeps anchored sections clear of the sticky navbar when jumped to.
const anchor = 'scroll-mt-28'

// Parent template for a single destination / expression. Receives one CMS record
// (`data`) — defaulting to the mock — and passes each field down to the child
// components. Wire `data` to a build-time Notion fetch (keyed by slug) to make it
// live; the child components already consume props, so nothing here changes.
export default function Expression() {
  // Route /expression/:slug → the matching Notion record from expressions.json.
  // Falls back to the mock when the slug is missing or Notion hasn't been fetched.
  const { slug } = useParams()
  const data = (slug && expressions[slug]) || expressionMock

  const rootRef = useRef(null)

  // Per-section GSAP text reveal: when a section scrolls into view its headings
  // and paragraphs stagger in one after another (not all on load). The rolling
  // stat numbers ([data-count]) animate themselves, so they're excluded here.
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // h2[data-split] (JoinUsCta) and [data-count] (rolling stats) animate themselves
    const SEL = 'h1, h2:not([data-split]), h3, p:not([data-count])'
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const texts = entry.target.querySelectorAll(SEL)
          gsap.to(texts, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12 })
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    root.querySelectorAll('section').forEach((section) => {
      gsap.set(section.querySelectorAll(SEL), { autoAlpha: 0, y: 24 })
      io.observe(section)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="bg-surface-page">
      <ExpressionHero
        logo={data.logo}
        heroImage={data.heroImage}
        city={data.city}
        venue={data.venue}
        date={data.date}
        tags={data.tags}
      />

      <div id="revival" className={anchor}>
        <ExpressionOverview
          theme={data.theme}
          verse={data.verse}
          overview={data.overview}
          featureStats={data.featureStats}
        />
        <NumbersBand stats={data.numbers} />
      </div>

      <div id="documentary" className={anchor}>
        <DocumentarySection documentary={data.documentary} logo={data.logo} />
      </div>

      <div id="minister" className={anchor}>
        <GuestMinisters ministers={data.ministers} />
      </div>

      <div id="charity" className={anchor}>
        <CharitySection charity={data.charity} />
        <PartnersBar partners={data.partners} />
      </div>

      <div id="gallery" className={anchor}>
        <Gallery title={data.gallery.title} images={data.gallery.images} />
      </div>

      <JoinUsCta />
    </div>
  )
}
