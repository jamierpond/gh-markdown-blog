import { generateIconResponse } from '../lib/icon-utils';
import { getUsername } from '../shared';

export const runtime = 'edge';

export async function GET() {
  const username = await getUsername();
  const letter = username ? username.charAt(0).toUpperCase() : 'M';

  const fontData = await fetch(
    'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  // Favicons are typically small, 32x32 is a common size.
  // Adjust font size to fit well within the 32x32 canvas.
  return generateIconResponse(32, 24, fontData, letter);
}
