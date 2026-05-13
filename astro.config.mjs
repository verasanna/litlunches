// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://litlunches.space/',
	integrations: [
		starlight({
  title: 'Litlunches',
  social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/verasanna' }],
  components: {
    Footer: './src/components/CustomFooter.astro',
    Head: './src/components/Head.astro',
  },
  sidebar: [
    {
      label: 'Easy Spanish books',
      autogenerate: { directory: 'spanish' },
    },
        {
      label: 'Easy English books',
      autogenerate: { directory: 'english' },
    },
    {
      label: 'About',
      autogenerate: { directory: 'about' },
    },
  ],
  head: [
  {
  tag: 'link',
  attrs: {
    rel: 'alternate',
    type: 'application/rss+xml',
    title: 'Litlunches — Book Lists & Guides',
    href: '/docs-rss.xml',
  },
  },
  {
  tag: 'link',
  attrs: {
    rel: 'alternate',
    type: 'application/feed+json',
    title: 'Book Lists JSON Feed',
    href: '/feed.json',
  },
  },
  {
    tag: 'meta',
    attrs: { name: 'theme-color', content: '#fbfbf9' },
  },
  {
    tag: 'script',
    attrs: { type: 'application/ld+json' },
    content: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Litlunches',
      url: 'https://litlunches.space/',
      description: 'Your comprehensible reading guide',
    }),
  },
],
}),
],
});
