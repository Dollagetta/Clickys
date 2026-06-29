import { Inter } from 'next/font/google';
import './globals.css';
// Placeholders for components we will create next
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReadingProgressBar from '../components/ReadingProgressBar';
import ScrollToTopButton from '../components/ScrollToTopButton';
import AppProviders from '../components/AppProviders'; // For client-side logic like AnimatePresence & AOS
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans', // CSS variable for the font
});

const siteName = "Clickys";
const siteUrl = "https://www.clickys.in"; // Replace with your actual domain

export const metadata = {
  metadataBase: new URL(siteUrl),
  // Basic metadata
  title: {
    default: "Clickys - Discover Top Amazon Picks & Deals",
    template: `%s | ${siteName}`
  },
  description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping. We do the research, so you can shop with confidence.",
  
  // Standard metadata
  keywords: "Amazon affiliate, product reviews, best deals, buying guides, tech gadgets, home appliances, electronics, smart home, affiliate marketing, product recommendations",
  applicationName: siteName,
  authors: [{ name: "Clickys Team", url: `${siteUrl}/about` }],
  generator: "Pixel Crafte",
  referrer: "origin-when-cross-origin",
  creator: "Pixel Crafte",
  publisher: siteName,
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    url: siteUrl,
    title: "Clickys - Discover Top Amazon Picks & Deals",
    description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping.",
    images: [
      {
        url: `${siteUrl}/favicon.svg`,
        width: 1200,
        height: 630,
        alt: "Clickys - Your Trusted Guide to Amazon's Best Finds",
      }
    ],
  },
  
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Clickys - Top Amazon Picks, Deals, and Reviews",
    description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping.",
    images: [`${siteUrl}/favicon.svg`],
    creator: "@clickys25",
  },
  
  // Verification for search consoles
  verification: {
    // google: "your-google-verification-code",
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Clickys",
              url: "https://www.clickys.in",
              description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping.",
              publisher: {
                "@type": "Organization",
                name: "Clickys",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.clickys.in/images/logosvg.svg"
                }
              }
            })
          }}
        />
        {/* Analytics script */}
      </head>
      <body suppressHydrationWarning>
        <Script id="cuelinks" strategy="afterInteractive">
          {`
            var cId = '239712';
            (function(d, t) {
              var s = document.createElement('script');
              s.type = 'text/javascript';
              s.async = true;
              s.src =
                (document.location.protocol == 'https:'
                  ? 'https://cdn0.cuelinks.com/js/'
                  : 'http://cdn0.cuelinks.com/js/') + 'cuelinksv2.js';
              document.getElementsByTagName('body')[0].appendChild(s);
            })();
          `}
        </Script>
        <ReadingProgressBar />
        <AppProviders> {/* Handles AnimatePresence and AOS initialization */}
          <Navbar key="navbar" />
          <main key="main" style={{ minHeight: 'calc(100vh - 150px)', paddingTop: '90px' }}>
            {children}
          </main>
          <Footer key="footer" />
          <ScrollToTopButton />
        </AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
