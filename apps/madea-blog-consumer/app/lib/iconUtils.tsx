import { ImageResponse } from "next/og";

export function generateIconResponse(size: number, fontSize: number, fontData: ArrayBuffer, letter: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom right, #8b5cf6, #ec4899)',
          color: 'white',
          fontFamily: '"CustomFont"',
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          border: '2px solid rgba(255,255,255,0.2)',
        }}
      >
        {letter}
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        {
          name: 'CustomFont',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
