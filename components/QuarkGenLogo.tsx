import React from 'react';
import Image from 'next/image';

interface QuarkGenLogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
  iconOnly?: boolean;
  href?: string | null;
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
  href = 'https://www.quarkgen.ai/',
}) => {
  const content = iconOnly ? (
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
  ) : (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        id="quarkgen-official-logo"
        src="/quarkLogo.png"
        alt="QuarkGen"
        width={Math.round(size * (1007 / 336))}
        height={size}
        style={{ height: `${size}px`, width: 'auto' }}
        className="object-contain select-none max-h-full"
        priority={priority}
        unoptimized
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center hover:opacity-85 transition-opacity focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0084FF] rounded-lg"
        title="QuarkGen AI - Official Website"
      >
        {content}
      </a>
    );
  }

  return content;
};
