import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Blog Post';
  const author = searchParams.get('author') || 'Author';
  const username = searchParams.get('username') || '';
  const date = searchParams.get('date') || '';

  // Load Geist font (or fallback to system font)
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
          // dark:from-black dark:via-gray-950 dark:to-black
          background: 'linear-gradient(to bottom right, #000000, #0a0a0f, #000000)',
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: 'relative',
        }}
      >
        {/* Gradient orbs - dark:bg-purple-900, dark:bg-blue-900, dark:bg-pink-900 with opacity-20 */}
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
          {/* Card container with glassmorphism - dark:bg-gray-900/50 dark:border-gray-800/50 */}
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
            {/* Author info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              {username && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`https://github.com/${username}.png`}
                  alt={author}
                  width="64"
                  height="64"
                  style={{
                    borderRadius: '50%',
                    marginRight: '20px',
                  }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    fontFamily: 'Inter',
                    background: 'linear-gradient(to right, #9333ea, #ec4899, #3b82f6)',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {author}
                </div>
                {date && (
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#9ca3af',
                      fontWeight: '400',
                      fontFamily: 'Inter',
                    }}
                  >
                    {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>

            {/* Title - vibrant gradient for dark mode */}
            <h1
              style={{
                fontSize: title.length > 60 ? '48px' : title.length > 40 ? '56px' : '64px',
                fontWeight: '800',
                fontFamily: 'Inter',
                background: 'linear-gradient(to right, #a855f7, #ec4899, #60a5fa)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
                margin: 0,
                textAlign: 'center',
                paddingLeft: '20px',
                paddingRight: '20px',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer branding - dark:text-purple-400 */}
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
            madea.blog
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
