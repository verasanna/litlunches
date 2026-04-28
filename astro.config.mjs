// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://litlunches.space/',
	integrations: [
		starlight({
			title: 'Litlunches',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/verasanna' }],
			components: {
    			Footer: './src/components/CustomFooter.astro',
  			},
			head: [
    		{
      			tag: 'meta',
      			attrs: {
        			property: 'og:image',
        			content: 'https://litlunches.space/og-default.jpg',
      			},
   			},
    		{
      			tag: 'meta',
      			attrs: {
        			name: 'twitter:card',
        			content: 'summary_large_image',
      			},
    		},
    		{
      			tag: 'meta',
      			attrs: {
        			name: 'twitter:image',
        			content: 'https://litlunches.space/og-default.jpg',
      			},
    		},
    		{
      			tag: 'meta',
      			attrs: {
        			name: 'theme-color',
        			content: '#fbfbf9',
      			},
    		},
    		{
      			tag: 'script',
      			attrs: { type: 'application/ld+json' },
      			content: JSON.stringify({
        			"@context": "https://schema.org",
        			"@type": "WebSite",
        			name: "Litlunches",
        			url: "https://litlunches.space/",
        			description: "Your comprehensible reading guide",
      			}),
    		},
  			],
			sidebar: [
				{
					label: 'Easy Spanish books',
					autogenerate: { directory: 'spanish' },
				},
				{
					label: 'About',
					autogenerate: { directory: 'about' },
				},
			],
		}),
	],
});
