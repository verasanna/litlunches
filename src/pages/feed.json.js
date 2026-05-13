import { getCollection } from 'astro:content';
import { site } from '../config/site';

export async function GET(context) {
  const siteUrl = context.site?.href ?? site.url;

  const docs = (await getCollection('docs')).filter(
    (doc) => doc.id !== 'index'
  );

  const items = docs.map((doc) => {
    const url = new URL(`/${doc.id}/`, siteUrl).href;

    // Extract all headings (H1–H6) from raw markdown body.
    // render() is unavailable in API routes, so we parse doc.body directly.
    let position = 1;
    const hasPart = (doc.body ?? '')
      .split('\n')
      .filter((line) => /^#{1,6} /.test(line))
      .map((line) => {
        const name = line.replace(/^#{1,6} /, '').trim();
        const slug = name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        return {
          '@type': 'SiteNavigationElement',
          position: position++,
          name,
          url: `${url}#${slug}`,
        };
      });

    return {
      id: url,
      url,
      title: doc.data.title,
      summary: doc.data.description,
      date_published: new Date('2026-01-01').toISOString(),
      tags: ['guide'],
      hasPart,
    };
  });

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: site.name,
    description: site.description,
    home_page_url: siteUrl,
    feed_url: new URL('/feed.json', siteUrl).href,
    language: 'en',
    authors: [
      {
        name: site.author.name,
        url: site.author.url,
      },
    ],
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
