import '@/styles/globals.css';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import Providers from '@/components/layout/providers';

import { siteConfig } from '@/config/site';
import { dm_sans, inter } from '@/lib/fonts';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// todo
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'i18n',
    'internationalization',
    'localization',
    'translation',
    'language',
    'chatgpt-i18n',
    'lingo',
  ],
  authors: [
    {
      name: 'shixin.guo',
      url: '///',
    },
  ],
  creator: 'shixin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [`${siteConfig.url}/og.jpg`],
  //   creator: '@shixin',
  // },
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/panda.png',
  },
  manifest: `${siteConfig.url}/favicons/site.webmanifest`,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dm_sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "krkczv16xj");
          `,
          }}
        />
      </head>
      <body>
        <Providers session={session}>
          <Header />
          {children}
          {/* todo */}
          <Footer />
          <SpeedInsights />
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
