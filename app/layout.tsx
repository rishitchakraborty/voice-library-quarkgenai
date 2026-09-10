import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'QuarkGen.AI | Multilingual Voice Gen AI Studio & Library',
  description: 'QuarkGen.AI Enterprise Multilingual Voice Gen AI Studio & Audio Library. Powered by Private Enterprise LLMs, ultra-low latency TTS, 18+ global languages, and waveform audio player. Developed by QuarkGen.AI',
  icons: {
    icon: '/quarkIcon.png',
    shortcut: '/quarkIcon.png',
    apple: '/quarkIcon.png',
  },
  openGraph: {
    title: 'QuarkGen.AI | Multilingual Voice Gen AI Studio & Library',
    description: 'QuarkGen.AI Enterprise Multilingual Voice Gen AI Studio & Audio Library. Powered by Private Enterprise LLMs, ultra-low latency TTS, 18+ global languages, and waveform audio player. Developed by QuarkGen.AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuarkGen.AI | Multilingual Voice Gen AI Studio & Library',
    description: 'QuarkGen.AI Enterprise Multilingual Voice Gen AI Studio & Audio Library. Powered by Private Enterprise LLMs, ultra-low latency TTS, 18+ global languages, and waveform audio player. Developed by QuarkGen.AI',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="260x260" href="/quarkIcon.png" />
        <link rel="shortcut icon" href="/quarkIcon.png" />
        <link rel="apple-touch-icon" href="/quarkIcon.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
