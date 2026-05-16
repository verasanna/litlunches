import { getCollection } from 'astro:content';
import { site } from '../config/site';

function getItemMeta(docId) {
  if (docId.startsWith('spanish/')) {
    return { language: 'es', content_type: 'reading-list' };
  }
  if (docId.startsWith('english/')) {
    return { language: 'en', content_type: 'reading-list' };
  }
  return { language: 'en', content_type: 'guide' };
}

function getTags(docId) {
  return ['guide', ...docId.split('/')];
}

// For reading lists, numbered H2s like "1. Title", "2. Title" etc. are the book entries.
// Sections 1–5 and "Further reading" are free; 6+ are paid.
function getSectionAccess(docId, name) {
  const isReadingList =
    docId.startsWith('spanish/') || docId.startsWith('english/');

  if (!isReadingList) return 'free';

  if (/^further reading$/i.test(name.trim())) return 'free';

  const match = name.match(/^(\d+)\./);
  if (match) {
    return parseInt(match[1], 10) <= 5 ? 'free' : 'paid';
  }

  // Non-numbered headings (intro paragraphs rendered as H2, etc.) are free
  return 'free';
}

function extractHasPart(body, baseUrl, docId) {
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
    const access = getSectionAccess(docId, name);

    let content_text = null;
    if (access === 'free') {
      const nextIndex = headingIndices[i + 1] ?? lines.length;
      content_text =
        lines
          .slice(lineIndex + 1, nextIndex)
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
      access,
      content_text,
      token_price: access === 'paid' ? 0.001 : null,
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
    const { language, content_type } = getItemMeta(doc.id);
    const isReadingList =
      doc.id.startsWith('spanish/') || doc.id.startsWith('english/');
    const itemAccess = isReadingList ? 'freemium' : 'free';
    const hasPart = extractHasPart(doc.body, url, doc.id);

    return {
      id: url,
      url,
      title: doc.data.title,
      summary: doc.data.description,
      date_published: new Date('2026-01-01').toISOString(),
      tags: getTags(doc.id),
      _ext: {
        access: itemAccess,
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
