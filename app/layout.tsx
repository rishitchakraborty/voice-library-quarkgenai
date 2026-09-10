import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'QuarkGen.AI | Multilingual Voice Gen AI Studio & Library',
  description: 'QuarkGen.AI Enterprise Multilingual Voice Gen AI Studio & Audio Library. Powered by Private Enterprise LLMs, ultra-low latency TTS, 18+ global languages, and waveform audio player. Developed by QuarkGen.AI',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/quarkIcon.png', sizes: '256x256', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="256x256" href="/quarkIcon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
