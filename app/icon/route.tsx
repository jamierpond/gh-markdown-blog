import { ImageResponse } from 'next/og';
import { getUsername } from '../shared';

export const runtime = 'edge';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export async function GET() {
  const username = await getUsername();

  // Get first letter of username, default to 'm' for madea.blog
  const letter = username ? username.charAt(0).toUpperCase() : 'M';

  // Load Inter font
  const fontData = await fetch(
    'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #3b82f6 100%)',
          borderRadius: '50%',
          position: 'relative',
        }}
      >
        {/* Inner shadow effect */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 50%)',
          }}
        />

        {/* Letter */}
        <div
          style={{
            fontSize: '42px',
            fontWeight: '800',
            fontFamily: 'Inter',
            color: 'white',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {letter}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
