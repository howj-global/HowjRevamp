import brazilLogo from '../assets/brand/howj-brazil-logo.png'

const base = import.meta.env.BASE_URL
const g = (name) => base + 'gallery/' + name
const m = (name) => base + 'ministers/' + name

// Mock "Expression" record — shaped to mirror a headless CMS / Notion database
// row. Swap this for a build-time Notion fetch (see scripts/fetch-notion-content)
// keyed by slug; every field below maps 1:1 to a Notion property.
export const expressionMock = {
  slug: 'brazil',
  logo: brazilLogo,
  heroImage: g('brazil-ministration-01.jpg'),

  // hero meta
  city: 'Brasília / Rio',
  venue: 'Venue Name',
  date: 'March 25, 2025',
  // each tag jumps to a section id on the page (see Expression.jsx anchors)
  tags: [
    { label: 'Revival', target: 'revival' },
    { label: 'Documentary', target: 'documentary' },
    { label: 'Minister', target: 'minister' },
    { label: 'Charity', target: 'charity' },
    { label: 'Gallery', target: 'gallery' },
  ],

  // overview
  theme: 'Christ Reedeemer',
  verse: 'Jesus Christ — The Redeemer · Galatians 3:13–14',
  overview:
    'In the heart of the Federal District at Brasília, the Brazil Expression declared Jesus as The Redeemer. Witness the light of Christ shining in one of the world’s busiest cities through worship, testimonies, and a powerful move of God.',
  featureStats: [
    { value: '500+', label: 'Total souls impacted', image: g('brazil-charity-01.jpg') },
    { value: '300+', label: 'In attendance', image: g('brazil-ministration-02.jpg') },
  ],

  // numbers band
  numbers: [
    { value: '15+', label: 'miracles documented' },
    { value: '20+', label: 'Impacted charity' },
    { value: '20+', label: 'Souls impacted through charity' },
  ],

  // documentary
  documentary: {
    image: g('brazil-ministration-03.jpg'),
    videoUrl: '#',
  },

  // guest ministers
  ministers: [
    { name: 'Israel Salazar', image: m('israel-salazar-brazil.jpg') },
    { name: 'Place Holder', image: g('brazil-ministration-04.jpg') },
    { name: 'Place Holder', image: g('brazil-ministration-05.jpg') },
  ],

  // charity feature
  charity: {
    title: 'Charity Place Holder Name',
    overview:
      'In the heart of the Federal District at Brasília, the Brazil Expression declared Jesus as The Redeemer. Witness the light of Christ shining in one of the world’s busiest cities through worship, testimonies, and a powerful move of God.',
    images: [g('brazil-charity-02.jpg'), g('brazil-charity-03.jpg')],
  },

  // partners (logos optional — placeholder circles render when omitted)
  partners: {
    label: 'Our Partners in Brazil',
    logos: [{ name: 'Partner One' }, { name: 'Partner Two' }],
  },

  // gallery carousel — all photos for this expression
  gallery: {
    title: 'Gallery',
    images: [
      g('brazil-charity-01.jpg'),
      g('brazil-charity-02.jpg'),
      g('brazil-charity-03.jpg'),
      g('brazil-ministration-10.jpg'),
      g('brazil-ministration-11.jpg'),
    ],
  },
}
