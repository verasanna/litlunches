// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Litlunches',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/verasanna' }],
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
