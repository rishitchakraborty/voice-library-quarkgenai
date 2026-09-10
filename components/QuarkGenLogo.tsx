import React from 'react';
import Image from 'next/image';

interface QuarkGenLogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

/**
 * Official QuarkGen Brand Logo
 * Uses the uploaded logo asset exclusively (/quarkLogo.png) without any synthetic or generated alternatives.
 */
export const QuarkGenLogo: React.FC<QuarkGenLogoProps> = ({
  className = '',
  size = 36,
  priority = false,
}) => {
  // Official uploaded QuarkGen logo aspect ratio is 940 / 280 ≈ 3.357
  const width = Math.round(size * 3.357);

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        src="/quarkLogo.png"
        alt="QuarkGen"
        width={width}
        height={size}
        style={{ height: `${size}px`, width: 'auto' }}
        className="object-contain"
        priority={priority}
      />
    </div>
  );
};
