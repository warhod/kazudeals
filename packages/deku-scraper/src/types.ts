export interface GameData {
  title: string;
  deku_url: string;
  image_url: string | null;
  current_price: number | null;
  msrp: number | null;
  description: string | null;
  platform: string;
}

export interface SearchResult {
  title: string;
  deku_url: string;
  image_url: string | null;
  current_price: number | null;
}
