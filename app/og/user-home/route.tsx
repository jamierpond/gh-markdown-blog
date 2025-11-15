import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'Developer';
  const username = searchParams.get('username') || '';
  const bio = searchParams.get('bio') || '';
  const avatar = searchParams.get('avatar') || `https://github.com/${username}.png`;

  // Load Inter font
  const fontData = await fetch(
    'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #000000, #0a0a0f, #000000)',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(88, 28, 135, 0.5) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(30, 58, 138, 0.5) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '100px',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(131, 24, 67, 0.4) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Card container with glassmorphism */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(17, 24, 39, 0.6)',
              padding: '60px 80px',
              borderRadius: '24px',
              border: '1px solid rgba(31, 41, 55, 0.5)',
              boxShadow: '0 25px 50px rgba(147, 51, 234, 0.2)',
              maxWidth: '1000px',
            }}
          >
            {/* Avatar */}
            {avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt={name}
                width="120"
                height="120"
                style={{
                  borderRadius: '50%',
                  marginBottom: '30px',
                  border: '4px solid rgba(147, 51, 234, 0.5)',
                }}
              />
            )}

            {/* Name */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: '800',
                fontFamily: 'Inter',
                background: 'linear-gradient(to right, #a855f7, #ec4899, #60a5fa)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
                margin: '0 0 20px 0',
                textAlign: 'center',
                letterSpacing: '-0.02em',
              }}
            >
              {name}
            </h1>

            {/* Bio */}
            {bio && (
              <p
                style={{
                  fontSize: '28px',
                  color: '#9ca3af',
                  fontWeight: '400',
                  fontFamily: 'Inter',
                  textAlign: 'center',
                  margin: 0,
                  maxWidth: '800px',
                  lineHeight: 1.4,
                }}
              >
                {bio.length > 100 ? bio.slice(0, 100) + '...' : bio}
              </p>
            )}
          </div>

          {/* Footer branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: '700',
              fontFamily: 'Inter',
              color: '#c084fc',
            }}
          >
            {username}.madea.blog
          </div>
        </div>
      </div>
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
