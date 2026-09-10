import React from 'react';

interface QuarkGenLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  size?: number;
}

export const QuarkGenLogo: React.FC<QuarkGenLogoProps> = ({
  className = '',
  showText = true,
  textClassName = 'text-slate-900',
  size = 36,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Exact 3D Isometric Triskelion Mark matching QuarkGen brand */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs"
        aria-label="QuarkGen Emblem"
      >
        <defs>
          <linearGradient id="qg-exact-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0094FF" />
            <stop offset="100%" stopColor="#0080EA" />
          </linearGradient>
          <linearGradient id="qg-exact-side" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006EB8" />
            <stop offset="100%" stopColor="#005B9C" />
          </linearGradient>
        </defs>

        <g id="quarkgen-emblem-core" transform="translate(130, 130)">
          {/* Blade 1 (Top-Left) */}
          <g transform="rotate(240)">
            <polygon points="-52,-96 -14,-118 26,-95 -12,-73" fill="url(#qg-exact-top)" />
            <polygon points="-12,-73 26,-95 26,-66 -12,-44" fill="url(#qg-exact-side)" />

            <polygon points="-12,-38 26,-60 26,-15 -12,7" fill="url(#qg-exact-top)" />
            <polygon points="-12,7 26,-15 26,14 -12,36" fill="url(#qg-exact-side)" />
          </g>

          {/* Blade 2 (Right) */}
          <g transform="rotate(0)">
            <polygon points="-52,-96 -14,-118 26,-95 -12,-73" fill="url(#qg-exact-top)" />
            <polygon points="-12,-73 26,-95 26,-66 -12,-44" fill="url(#qg-exact-side)" />

            <polygon points="-12,-38 26,-60 26,-15 -12,7" fill="url(#qg-exact-top)" />
            <polygon points="-12,7 26,-15 26,14 -12,36" fill="url(#qg-exact-side)" />
          </g>

          {/* Blade 3 (Bottom-Left) */}
          <g transform="rotate(120)">
            <polygon points="-52,-96 -14,-118 26,-95 -12,-73" fill="url(#qg-exact-top)" />
            <polygon points="-12,-73 26,-95 26,-66 -12,-44" fill="url(#qg-exact-side)" />

            <polygon points="-12,-38 26,-60 26,-15 -12,7" fill="url(#qg-exact-top)" />
            <polygon points="-12,7 26,-15 26,14 -12,36" fill="url(#qg-exact-side)" />
          </g>
        </g>
      </svg>

      {showText && (
        <span className={`font-black tracking-tight text-lg sm:text-xl font-sans ${textClassName}`}>
          QuarkGen
        </span>
      )}
    </div>
  );
};
