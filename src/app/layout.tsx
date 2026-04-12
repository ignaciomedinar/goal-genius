import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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
    "football predictions, soccer predictions, match predictions, sports betting, football analysis, soccer analysis",
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
        url: "../public/logo.png",
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
  verification: {
    google: "your-google-verification-code",
  },
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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
