import Hero from '../components/Hero.jsx'
import StatsSection from '../components/StatsSection.jsx'
import RecapSection from '../components/RecapSection.jsx'
import MinistersSection from '../components/MinistersSection.jsx'
import MissionSection from '../components/MissionSection.jsx'
import CountryShowcase from '../components/CountryShowcase.jsx'

export default function Home() {
  return (
    <>
      <Hero />

      {/* Black master container so the gradient edges of the two sections blend
          into one another with no visible seam. */}
      <div className="bg-black">
        <StatsSection />
        <RecapSection />
      </div>

      <MinistersSection />

      <MissionSection />

      <CountryShowcase />
    </>
  )
}
