import React from 'react';
import Image from 'next/image';

interface QuarkGenLogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
  iconOnly?: boolean;
}

/**
 * Official QuarkGen Brand Logo
 * Uses the exact uploaded logo files (/quarkLogo.png and /quarkIcon.png) without any generic or synthetic alternatives.
 */
export const QuarkGenLogo: React.FC<QuarkGenLogoProps> = ({
  className = '',
  size = 36,
  priority = true,
  iconOnly = false,
}) => {
  if (iconOnly) {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <Image
          id="quarkgen-official-icon"
          src="/quarkIcon.png"
          alt="QuarkGen"
          width={size}
          height={size}
          className="object-contain select-none"
          priority={priority}
          unoptimized
        />
      </div>
    );
  }

  // Official uploaded QuarkGen logo aspect ratio is 940 / 280 ≈ 3.357
  const width = Math.round(size * 3.357);

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        id="quarkgen-official-logo"
        src="/quarkLogo.png"
        alt="QuarkGen"
        width={width}
        height={size}
        style={{ height: `${size}px`, width: 'auto' }}
        className="object-contain select-none max-h-full"
        priority={priority}
        unoptimized
      />
    </div>
  );
};
