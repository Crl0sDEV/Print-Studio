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
  }
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
