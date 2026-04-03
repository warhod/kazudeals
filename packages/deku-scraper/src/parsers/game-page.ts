import type { CheerioAPI } from 'cheerio';
import { GameData } from '../types';

function parsePriceText(raw: string): number | null {
  const text = raw.replace('$', '').trim();
  return text ? parseFloat(text) : null;
}

/** Parse a DekuDeals item detail page (matches `.price.current` / `.price.msrp` markup). */
export function parseGamePage($: CheerioAPI, url: string): GameData {
  const title = $('.item-name').text().trim() || $('h1').text().trim();
  const image_url = $('meta[property="og:image"]').attr('content') || null;
  const current_price_text = $('.price.current').first().text();
  const msrp_text = $('.price.msrp').first().text();
  const description =
    $('#descriptionCollapse .card-body').text().trim() || $('.item-description').text().trim();
  const platform = $('.platform-label').first().text().trim() || 'Switch';

  return {
    title,
    deku_url: url,
    image_url,
    current_price: parsePriceText(current_price_text),
    msrp: parsePriceText(msrp_text),
    description: description || null,
    platform,
  };
}
