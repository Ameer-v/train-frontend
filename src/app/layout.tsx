import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';

export const metadata: Metadata = {
  title: 'KA Citra Indonesia',
  description: 'Sistem Pemesanan Tiket Kereta Api',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: '"DM Sans", sans-serif' }}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
