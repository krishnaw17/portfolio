import { siGithub, siX, siSpotify, siApple } from 'simple-icons';

interface BrandIconProps {
  name: 'github' | 'linkedin' | 'twitter' | 'spotify' | 'apple';
  size?: number;
  className?: string;
  /** Set to true to use the official brand colour instead of currentColor */
  brandColor?: boolean;
}

// LinkedIn is not in simple-icons (trademarked). Inline official-style mark.
function LinkedInPath() {
  return (
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  );
}

const icons = {
  github: siGithub,
  twitter: siX,
  spotify: siSpotify,
  apple: siApple,
};

export function BrandIcon({ name, size = 16, className = '', brandColor = false }: BrandIconProps) {
  if (name === 'linkedin') {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={brandColor ? '#0A66C2' : 'currentColor'}
        aria-label="LinkedIn"
        className={className}
      >
        <LinkedInPath />
      </svg>
    );
  }
  const icon = icons[name];
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      // Use currentColor by default — GitHub's brand hex (#181717) is near-black
      // and invisible on dark backgrounds.
      fill={brandColor ? `#${icon.hex}` : 'currentColor'}
      aria-label={icon.title}
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
