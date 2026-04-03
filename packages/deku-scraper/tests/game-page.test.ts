import { describe, test, expect, beforeAll } from 'bun:test';
import * as cheerio from 'cheerio';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseGamePage } from '../src/parsers/game-page';

// We test the parsing logic directly using saved HTML fixtures,
// so we don't need to make real network requests in tests.
// This also protects us from DekuDeals HTML structure changes —
// when they change their layout, update the fixture + parsers.

function parseGamePageFromFixture(html: string, url: string) {
  const $ = cheerio.load(html);
  return parseGamePage($, url);
}

const FIXTURE_URL = 'https://www.dekudeals.com/items/the-legend-of-zelda-tears-of-the-kingdom';
let fixtureHtml: string;

beforeAll(() => {
  fixtureHtml = readFileSync(
    join(import.meta.dir, 'fixtures/zelda-totk.html'),
    'utf-8'
  );
});

describe('scrapeGame — parsing logic', () => {
  test('extracts title', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.title).toBe('The Legend of Zelda: Tears of the Kingdom');
  });

  test('extracts og:image as image_url', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.image_url).toContain('dekudeals.com');
  });

  test('extracts current_price as a number', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.current_price).toBe(51.99);
  });

  test('extracts msrp as a number', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.msrp).toBe(69.99);
  });

  test('extracts description', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.description).toContain('Hyrule');
  });

  test('extracts platform label', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.platform).toBe('Switch');
  });

  test('sets deku_url from input', () => {
    const result = parseGamePageFromFixture(fixtureHtml, FIXTURE_URL);
    expect(result.deku_url).toBe(FIXTURE_URL);
  });
});
