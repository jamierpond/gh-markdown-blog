export default function OgBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        color: 'white',
        position: 'relative',
        fontFamily: '"CustomFont"',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          backgroundColor: '#8b5cf6',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          backgroundColor: '#3b82f6',
          borderRadius: '50%',
          filter: 'blur(90px)',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: -100,
          width: 300,
          height: 300,
          backgroundColor: '#ec4899',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.2,
        }}
      />
      {children}
    </div>
  );
}
