-- Sample catalog rows for local development (no auth users required).

insert into public.games (
  title,
  deku_url,
  image_url,
  current_price,
  msrp,
  description,
  platform
)
values
  (
    'The Legend of Zelda: Tears of the Kingdom',
    'https://www.dekudeals.com/items/nintendo-switch/the-legend-of-zelda-tears-of-the-kingdom',
    null,
    59.99,
    69.99,
    'Open-air adventure sequel.',
    'Nintendo Switch'
  ),
  (
    'Hollow Knight',
    'https://www.dekudeals.com/items/nintendo-switch/hollow-knight',
    null,
    7.49,
    14.99,
    'Classic indie metroidvania.',
    'Nintendo Switch'
  ),
  (
    'Elden Ring',
    'https://www.dekudeals.com/items/playstation-5/elden-ring',
    null,
    39.99,
    59.99,
    'Action RPG by FromSoftware.',
    'PlayStation 5'
  )
on conflict (deku_url) do nothing;
