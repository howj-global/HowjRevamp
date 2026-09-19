// Documentary teaser: a play-button image beside the expression logo + label.
// The label comes from Notion's optional "Documentary Label" so an expression
// can say something other than the default (Chicago: "Watch Full Revival").
export default function DocumentarySection({ documentary, logo }) {
  const label = documentary.label || 'Watch the documentary'
  const hasVideo = documentary.videoUrl && documentary.videoUrl !== '#'

  return (
    <section className="mx-auto max-w-[90rem] px-6 py-2xl lg:px-4xl">
      <div className="flex flex-col items-center gap-lg lg:flex-row lg:items-end">
        <a
          href={documentary.videoUrl}
          // YouTube opens in a new tab, like the site's other external links,
          // so viewers don't lose their place on the expression page.
          {...(hasVideo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group relative block w-full overflow-hidden rounded-md lg:w-2/3"
          aria-label={label}
        >
          <img src={documentary.image} alt="" className="aspect-[16/11] w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-neutral-white/90 transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 size-8 fill-neutral-black" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </a>

        <div className="flex flex-col items-center gap-sm lg:w-1/3">
          <img src={logo} alt="" className="w-52" />
          <p className="font-condensed text-xl font-bold uppercase tracking-wide text-neutral-black">
            {label}
          </p>
        </div>
      </div>
    </section>
  )
}
