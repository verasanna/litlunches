export const site = {
  url: import.meta.env.SITE,  // Astro exposes astro.config site as SITE
  name: 'Litlunches',
  description: 'Your comprehensible reading guide',
  defaultOgImage: '/og-default.jpg',
  author: {
    name: 'Litlunches',
    url: 'https://litlunches.space',
  },
} as const;