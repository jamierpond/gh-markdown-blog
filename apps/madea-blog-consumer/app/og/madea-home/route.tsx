import OgBackground from '../og-background';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  // Load Inter font
  const fontData = await fetch(
    'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <OgBackground>
        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '70px',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Spacer */}
          <div style={{ height: '50px' }} />

          {/* Center content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '1000px',
            }}
          >
            {/* Emoji */}
            <div
              style={{
                fontSize: '120px',
                marginBottom: '40px',
              }}
            >
              📝
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '100px',
                fontWeight: '800',
                fontFamily: 'Inter',
                background: 'linear-gradient(to right, #a855f7, #ec4899, #60a5fa)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.1,
                margin: '0 0 30px 0',
                textAlign: 'center',
                letterSpacing: '-0.03em',
              }}
            >
              madea.blog
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontSize: '42px',
                color: '#9ca3af',
                fontWeight: '400',
                fontFamily: 'Inter',
                textAlign: 'center',
                margin: 0,
                maxWidth: '900px',
                lineHeight: 1.3,
              }}
            >
              Turn your GitHub markdown into a beautiful blog
            </p>
          </div>

          {/* Footer branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '32px',
              fontWeight: '700',
              fontFamily: 'Inter',
              color: '#c084fc',
            }}
          >
            madea.blog
          </div>
        </div>
      </OgBackground>
    ),
    {
      width: 1200,
      height: 630,
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
