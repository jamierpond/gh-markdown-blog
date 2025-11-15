import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Blog Post';
  const author = searchParams.get('author') || 'Author';
  const username = searchParams.get('username') || '';
  const date = searchParams.get('date') || '';

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)',
            backgroundSize: '60px 60px',
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
          }}
        >
          {/* Author info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '20px 40px',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
            }}
          >
            {username && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://github.com/${username}.png`}
                alt={author}
                width="60"
                height="60"
                style={{
                  borderRadius: '50%',
                  marginRight: '20px',
                  border: '3px solid white',
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {author}
              </div>
              {date && (
                <div
                  style={{
                    fontSize: '20px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              maxWidth: '1000px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 60 ? '60px' : '72px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                margin: 0,
                padding: '0 40px',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600',
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
    }
  );
}
