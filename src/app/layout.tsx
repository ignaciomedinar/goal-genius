import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.goal-genius.net"),
  title: "Goal Genius - Advanced Football Match Predictions",
  description:
    "Get accurate football match predictions with AI-powered analysis. Track accuracy, view detailed team statistics, and access comprehensive match insights for all major tournaments.",
  keywords:
    "football predictions today, soccer match predictions, Premier League predictions, Champions League predictions, football betting tips, free football predictions, AI football analysis, soccer predictions this week, match outcome predictions, football statistics",
  authors: [{ name: "Goal Genius" }],
  creator: "Goal Genius",
  publisher: "Goal Genius",
  openGraph: {
    title: "Goal Genius - Advanced Football Match Predictions",
    description:
      "Get accurate football match predictions with AI-powered analysis",
    url: "https://www.goal-genius.net",
    siteName: "Goal Genius",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Goal Genius Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goal Genius - Advanced Football Match Predictions",
    description:
      "Get accurate football match predictions with AI-powered analysis",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "PASTE_YOUR_CODE_HERE",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased min-h-screen bg-background`}
        suppressHydrationWarning={true}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Goal Genius",
              url: "https://www.goal-genius.net",
              description:
                "AI-powered football match predictions with accuracy tracking for all major leagues worldwide.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.goal-genius.net/predictions",
              },
            }),
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WRCQ41KVM8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WRCQ41KVM8');
          `}
        </Script>

        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
