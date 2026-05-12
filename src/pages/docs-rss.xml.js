import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

export async function GET(context) {
  const docs = (await getCollection('docs')).filter(
    // exclude the index page which has no meaningful description
    (doc) => doc.id !== 'index'
  );

  return rss({
    title: `${site.name} — Book Lists & Guides`,
    description: 'Reading lists and guides from Litlunches, organized by region and language.',
    site: context.site,
    items: docs.map((doc) => ({
      title: doc.data.title,
      description: doc.data.description,
      link: `/${doc.id}/`,
      pubDate: new Date('2026-01-01'), // static date for timeless content
    })),
    customData: `<language>en</language>`,
  });
}
