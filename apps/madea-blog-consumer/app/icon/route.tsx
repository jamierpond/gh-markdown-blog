import { generateIconResponse } from '../lib/icon-utils';
import { getUsername } from '../shared';

export const runtime = 'edge';

export async function GET() {
  const username = await getUsername();
  const letter = username ? username.charAt(0).toUpperCase() : 'M';

  const fontData = await fetch(
    'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  return generateIconResponse(64, 42, fontData, letter);
}
