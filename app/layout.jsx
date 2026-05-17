import { Inter } from 'next/font/google';
import './globals.css';
// Placeholders for components we will create next
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReadingProgressBar from '../components/ReadingProgressBar';
import ScrollToTopButton from '../components/ScrollToTopButton';
import AppProviders from '../components/AppProviders'; // For client-side logic like AnimatePresence & AOS
import Script from "next/script";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans', // CSS variable for the font
});

/*
const siteName = "Clickys";
const siteUrl = "https://www.clickys.in"; // Replace with your actual domain

export const metadata = {
  // Basic metadata
  title: {
    default: "Clickys - Discover Top Amazon Picks & Deals",
    template: `%s | ${siteName}`
  },
  description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping. We do the research, so you can shop with confidence.",
  
  // Standard metadata
  keywords: "Amazon affiliate, product reviews, best deals, buying guides, tech gadgets, home appliances, electronics, smart home, affiliate marketing, product recommendations",
  applicationName: siteName,
  authors: [{ name: "AffiliateAura Team", url: `${siteUrl}/about` }],
  generator: "Pixel Crafte",
  referrer: "origin-when-cross-origin",
  creator: "Pixel Crafte",
  publisher: siteName,
  formatDetection: {
    email: "affiliateaurateam@gmail.com",
    address: "Peddapuram, Andhra Pradesh, India",
    telephone: "+910000000000",
  },
  
  // Icons
  icons: {
    icon: '/click.svg',
    apple: '/click.svg',
  },
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    url: siteUrl,
    title: "AffiliateAura - Discover Top Amazon Picks & Deals",
    description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping.",
    images: [
      {
        url: `${siteUrl}/og-images/homepage-affiliateaura.jpg`, // Ensure this image exists in /public/og-images/
        width: 1200,
        height: 630,
        alt: "AffiliateAura - Your Trusted Guide to Amazon's Best Finds",
      }
    ],
  },
  
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "AffiliateAura - Top Amazon Picks, Deals, and Reviews",
    description: "Your ultimate guide to the best products, exclusive deals, and honest reviews for Amazon shopping.",
    images: [`${siteUrl}/og-images/homepage-affiliateaura.jpg`], // Ensure this image exists
    creator: "@AffiliateAura", // Replace with actual Twitter handle
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
};
*/

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZVHNBRCRHH"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZVHNBRCRHH');
          `}
        </Script>
        {/* Analytics script */}
       {/* Analytics script */}
        <Script id="cuelinks" strategy="lazyOnload" type="text/javascript">
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


      </head>
      <body suppressHydrationWarning>
        <ReadingProgressBar />
        <AppProviders> {/* Handles AnimatePresence and AOS initialization */}
          <Navbar key="navbar" />
          <main key="main" style={{ minHeight: 'calc(100vh - 150px)', paddingTop: '90px' }}>
            {children}
          </main>
          <Footer key="footer" />
          <ScrollToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}
