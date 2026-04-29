export const site = {
  url: 'https://litlunches.space',
  name: 'Litlunches',
  description: 'Your comprehensible reading guide',
  defaultOgImage: '/og-default.jpg',
  author: {
    name: 'Litlunches',
    url: 'https://litlunches.space',
  },
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

