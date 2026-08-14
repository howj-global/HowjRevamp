import FeatureStatCard from './FeatureStatCard.jsx'

// Theme + bible verse + overview copy on the left; two feature-stat image cards
// on the right. `items-stretch` keeps the two cards the same height.
export default function ExpressionOverview({ theme, verse, overview, featureStats = [] }) {
  return (
    <section className="mx-auto max-w-[90rem] px-6 py-2xl lg:px-4xl">
      {/* min-h + items-end reproduces the Figma's tall stage: content bottom-aligns,
          leaving generous breathing room above (matches node 175:5510). */}
      <div className="flex flex-col gap-2xl lg:min-h-[37.5rem] lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[30rem]">
          <h2 className="font-condensed text-5xl font-bold uppercase leading-[0.95] text-neutral-black sm:text-6xl lg:text-7xl">
            {theme}
          </h2>
          <p className="mt-md font-body text-lg font-light text-neutral-black">{verse}</p>
          <p className="mt-lg font-body text-lg leading-relaxed text-neutral-black">{overview}</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-md sm:grid-cols-2 lg:w-[44rem] lg:shrink-0">
          {featureStats.map((stat, i) => (
            <FeatureStatCard key={i} image={stat.image} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}
