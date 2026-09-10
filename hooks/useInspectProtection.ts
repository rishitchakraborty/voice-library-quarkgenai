'use client';

import { useState, useCallback } from 'react';

export function useInspectProtection() {
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  const dismissNotice = useCallback(() => {
    setSecurityNotice(null);
  }, []);

  return {
    securityNotice,
    dismissNotice,
  };
}
