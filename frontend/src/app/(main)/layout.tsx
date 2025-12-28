import '@app/globals.css';
import { Montserrat } from 'next/font/google';
import ClientLayout from './client-layout';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Ping chat',
  description: 'Test task example',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-dvh">
      <body
        className={`${montserrat.variable} min-h-dvh flex dark:bg-[#1d1d1d] bg-zinc-400`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
