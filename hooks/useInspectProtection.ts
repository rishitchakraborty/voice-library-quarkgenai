'use client';

import { useEffect, useState } from 'react';

export function useInspectProtection() {
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  useEffect(() => {
    // 1. Scrub console outputs so nothing leaks into the DevTools Console
    const noop = () => {};
    const originalLog = console.log;

    try {
      // Print single enterprise security disclaimer once
      originalLog(
        '%c🔒 QuarkGen Enterprise Route Protection Enabled',
        'color: #0084FF; font-size: 14px; font-weight: bold; background: #E0F2FE; padding: 4px 10px; border-radius: 6px;'
      );
      originalLog(
        '%cDirect API inspection, console telemetry sniffing, and unauthorized endpoint extraction are restricted.',
        'color: #64748B; font-size: 11px;'
      );

      // Nullify sensitive console methods in production / client
      console.log = noop;
      console.info = noop;
      console.debug = noop;
      console.dir = noop;
      console.table = noop;
    } catch {
      // ignore
    }

    const showNotice = (msg: string) => {
      setSecurityNotice(msg);
      const timer = setTimeout(() => {
        setSecurityNotice(null);
      }, 3200);
      return () => clearTimeout(timer);
    };

    // 2. Prevent right-click context menu (which gives "Inspect" & "View Page Source")
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showNotice('QuarkGen Shield: Inspect & Context Menu are disabled for security.');
      return false;
    };

    // 3. Prevent DevTools keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        showNotice('Developer Tools access is restricted by QuarkGen Security.');
        return false;
      }

      // Ctrl + Shift + I / Cmd + Option + I (Inspect)
      // Ctrl + Shift + J / Cmd + Option + J (Console)
      // Ctrl + Shift + C / Cmd + Option + C (Element picker)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.shiftKey || e.altKey) &&
        (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')
      ) {
        e.preventDefault();
        e.stopPropagation();
        showNotice('Inspector shortcuts are disabled by QuarkGen Shield.');
        return false;
      }

      // Ctrl + U / Cmd + U (View Page Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        showNotice('Source code viewing is restricted by QuarkGen Shield.');
        return false;
      }

      // Ctrl + S / Cmd + S (Save Page / Bundle)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return { securityNotice, dismissNotice: () => setSecurityNotice(null) };
}
