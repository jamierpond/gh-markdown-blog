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
            justifyContent: 'space-between',
            padding: '70px',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* Top section - Author info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {username && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://github.com/${username}.png`}
                alt={author}
                width="100"
                height="100"
                style={{
                  borderRadius: '50%',
                  marginRight: '30px',
                  border: '4px solid rgba(147, 51, 234, 0.3)',
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '48px',
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
                    fontSize: '32px',
                    color: '#9ca3af',
                    fontWeight: '400',
                    fontFamily: 'Inter',
                    marginTop: '8px',
                  }}
                >
                  {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Middle section - Title */}
          <h1
            style={{
              fontSize: title.length > 80 ? '64px' : title.length > 60 ? '72px' : title.length > 40 ? '80px' : '90px',
              fontWeight: '800',
              fontFamily: 'Inter',
              background: 'linear-gradient(to right, #a855f7, #ec4899, #60a5fa)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1.1,
              margin: '0',
              textAlign: 'center',
              paddingLeft: '40px',
              paddingRight: '40px',
              letterSpacing: '-0.03em',
              maxWidth: '1100px',
            }}
          >
            {title}
          </h1>

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
