import { generateIconResponse } from '../lib/iconUtils';
import { getUsername } from '../shared';

export const runtime = 'edge';

export async function GET() {
  const username = await getUsername();
  const letter = username ? username.charAt(0).toUpperCase() : 'M';

  const fontData = await fetch(
    'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  return generateIconResponse(180, 120, fontData, letter);
}
