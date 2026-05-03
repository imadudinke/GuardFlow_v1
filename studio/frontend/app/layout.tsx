import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/lib/api/config'; // Initialize API configuration
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://guard-flow-v1.vercel.app",
  ),
  title: {
    default: "GuardFlow Studio | Real-time Threat Intelligence for FastAPI",
    template: "%s | GuardFlow Studio",
  },
  description:
    "GuardFlow Studio is a real-time threat intelligence and control plane for FastAPI teams, combining SDK telemetry, fingerprint insights, and actionable security operations dashboards.",
  applicationName: "GuardFlow Studio",
  keywords: [
    "GuardFlow",
    "FastAPI security",
    "API threat detection",
    "threat intelligence",
    "bot detection",
    "security dashboard",
    "fingerprinting",
    "rate limiting",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GuardFlow Studio",
    title: "GuardFlow Studio | Real-time Threat Intelligence for FastAPI",
    description:
      "Detect, investigate, and respond to API abuse in real time with GuardFlow Studio.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "GuardFlow Studio threat intelligence platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuardFlow Studio | Real-time Threat Intelligence for FastAPI",
    description:
      "Detect, investigate, and respond to API abuse in real time with GuardFlow Studio.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/favicon.svg" }],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "GuardFlow Studio",
      url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://guard-flow-v1.vercel.app",
      description:
        "Real-time threat intelligence and security operations platform for FastAPI workloads.",
    },
    {
      "@type": "SoftwareApplication",
      applicationCategory: "SecurityApplication",
      name: "GuardFlow Studio",
      operatingSystem: "Web",
      description:
        "Security control plane for API threat monitoring, telemetry analysis, and project-level response workflows.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
