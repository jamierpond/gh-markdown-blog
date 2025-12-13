interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

// Generate a consistent color from a string (name)
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate hue in the purple/pink range for consistency with the theme
  const hue = 250 + (Math.abs(hash) % 60); // 250-310 range (purple to pink)
  return `hsl(${hue}, 65%, 55%)`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, size = 40, className = '' }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const fontSize = size * 0.4;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill={bgColor}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontSize={fontSize}
        fontWeight="600"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}

// For use in places that need a data URL (like Image src or non-React contexts)
export function generateAvatarDataUrl(name: string, size: number = 128): string {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);
  const fontSize = size * 0.4;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bgColor}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-size="${fontSize}" font-weight="600" font-family="system-ui, -apple-system, sans-serif">${initials}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
