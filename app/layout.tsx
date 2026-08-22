import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Prynt",
    default: "Prynt - Modern Print Shop Management",
  },
  description: "Enterprise-grade SaaS platform for print shop owners to manage orders, automate layouts, and boost revenue.",
  keywords: ["print shop software", "printing business management", "SaaS", "print studio", "printing layout generator"],
  authors: [{ name: "Prynt Team" }],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://prynt.vercel.app", // Adjust if you have a custom domain
    title: "Prynt - Modern Print Shop Management",
    description: "Enterprise-grade SaaS platform for print shop owners to manage orders, automate layouts, and boost revenue.",
    siteName: "Prynt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prynt - Modern Print Shop Management",
    description: "Enterprise-grade SaaS platform for print shop owners to manage orders, automate layouts, and boost revenue.",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' }
    ]
  }
};

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "scroll-smooth", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
