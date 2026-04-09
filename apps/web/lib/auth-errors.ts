import type { AuthError } from '@supabase/supabase-js';

/**
 * Turn Supabase auth / network failures into something actionable in the UI.
 * "Failed to fetch" almost always means the browser never reached Supabase (URL, DNS, firewall, ad blocker), not a wrong password.
 */
export function formatAuthError(error: AuthError | Error | null | undefined): string {
  if (!error) return 'Unknown error';
  const msg = error.message || String(error);

  if (/failed to fetch|networkerror|load failed|network request failed/i.test(msg)) {
    return [
      msg,
      '',
      'The browser could not reach your Supabase project. This request does not go through the Next.js server, so you will not see it in `just dev` terminal logs.',
      '',
      'Check:',
      '• DevTools → Network: find the failing request to …/auth/v1/signup (red). Note the full URL.',
      '• NEXT_PUBLIC_SUPABASE_URL in apps/web/.env.local must be reachable from your machine (e.g. https://….supabase.co). If you use http://127.0.0.1:54321, Supabase must be running on your host where the browser runs—not only inside a remote container.',
      '• Restart `just dev` after changing .env.local so Next embeds the new values.',
    ].join('\n');
  }

  return msg;
}

export function isAuthEnvConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key && url.startsWith('http'));
}
