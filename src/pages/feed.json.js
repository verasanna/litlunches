import { getCollection } from 'astro:content';
import { site } from '../config/site';

function getItemMeta(docId) {
  if (docId.startsWith('spanish/')) {
    return { language: 'es', content_type: 'reading-list', access: 'paid' };
  }
  if (docId.startsWith('english/')) {
    return { language: 'en', content_type: 'reading-list', access: 'paid' };
  }
  return { language: 'en', content_type: 'guide', access: 'free' };
}

function getTags(docId) {
  return ['guide', ...docId.split('/')];
}

// Split raw markdown into sections keyed by heading line index.
// For each heading, content_text is everything up to the next heading,
// stripped of markdown syntax and trimmed.
function extractHasPart(body, baseUrl, itemAccess) {
  const lines = (body ?? '').split('\n');
  const headingIndices = lines.reduce((acc, line, i) => {
    if (/^#{1,6} /.test(line)) acc.push(i);
    return acc;
  }, []);

  return headingIndices.map((lineIndex, i) => {
    const line = lines[lineIndex];
    const name = line.replace(/^#{1,6} /, '').trim();
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const url = `${baseUrl}#${slug}`;

    let content_text = null;
    if (itemAccess === 'free') {
      const nextIndex = headingIndices[i + 1] ?? lines.length;
      content_text = lines
        .slice(lineIndex + 1, nextIndex)
        // Strip markdown: blockquotes, bold/italic, links, images, inline code
        .map((l) =>
          l
            .replace(/^>\s?/, '')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/[*_`]/g, '')
            .trim()
        )
        .filter((l) => l.length > 0)
        .join('\n')
        .trim() || null;
    }

    return {
      position: i + 1,
      name,
      url,
      access: itemAccess,
      content_text,
      token_price: itemAccess === 'paid' ? 0.001 : null,
    };
  });
}

export async function GET(context) {
  const siteUrl = context.site?.href ?? site.url;

  const docs = (await getCollection('docs')).filter(
    (doc) => doc.id !== 'index'
  );

  const items = docs.map((doc) => {
    const url = new URL(`/${doc.id}/`, siteUrl).href;
    const { language, content_type, access } = getItemMeta(doc.id);
    const hasPart = extractHasPart(doc.body, url, access);

    return {
      id: url,
      url,
      title: doc.data.title,
      summary: doc.data.description,
      date_published: new Date('2026-01-01').toISOString(),
      tags: getTags(doc.id),
      _ext: {
        access,
        language,
        content_type,
        hasPart,
      },
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
    _ext: {
      source_type: 'jsonfeed',
      access_model: 'freemium',
      publisher: {
        name: site.author.name,
        url: site.author.url,
      },
    },
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
