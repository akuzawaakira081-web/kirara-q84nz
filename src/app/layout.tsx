import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KIRARA MUSE',
  description: '子どものアート作品ギャラリー',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
