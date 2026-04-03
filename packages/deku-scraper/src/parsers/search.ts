import type { CheerioAPI } from 'cheerio';
import { SearchResult } from '../types';

function parsePriceText(raw: string): number | null {
  const text = raw.replace('$', '').trim();
  return text ? parseFloat(text) : null;
}

/** Parse DekuDeals search results grid (same `.price.current` convention as item pages). */
export function parseSearchResults($: CheerioAPI, baseUrl: string): SearchResult[] {
  const results: SearchResult[] = [];

  $('.item-grid .cell').each((_, el) => {
    const $el = $(el);
    const title = $el.find('.name').text().trim();
    const relative_url = $el.find('a').attr('href');
    const deku_url = relative_url
      ? relative_url.startsWith('http')
        ? relative_url
        : baseUrl + relative_url
      : '';
    const image_url = $el.find('.main-image img').attr('src') || null;
    const current_price_text = $el.find('.price.current').text();

    if (title && deku_url) {
      results.push({
        title,
        deku_url,
        image_url,
        current_price: parsePriceText(current_price_text),
      });
    }
  });

  return results;
}
