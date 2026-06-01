import type { Metadata } from "next";
import { Montserrat, Poppins, Bodoni_Moda } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { JsonLd } from "@/components/seo/json-ld";
import {
  organizationSchema,
  websiteSchema,
} from "@/components/seo/structured-data";
import { getAppUrl } from "@/lib/utils/app-url";
import { ROUTES } from "@/lib/constants/routes";

const baseUrl = getAppUrl();

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Lily Waist Line | Premium Waist Trainers",
    template: "%s | Lily Waist Line",
  },
  description: "Premium waist trainers and shapewear for the modern woman. Sculpt your silhouette with luxury and confidence.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: ROUTES.HOME,
  },
  openGraph: {
    title: "Lily Waist Line | Premium Waist Trainers",
    description: "Premium waist trainers and shapewear for the modern woman. Sculpt your silhouette with luxury and confidence.",
    url: baseUrl,
    siteName: "Lily Waist Line",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-img.jpg",
        width: 1200,
        height: 630,
        alt: "Lily Waist Line",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lily Waist Line | Premium Waist Trainers",
    description: "Premium waist trainers and shapewear for the modern woman. Sculpt your silhouette with luxury and confidence.",
    images: ["/og-img.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "selection:bg-primary selection:text-primary-foreground", poppins.variable, montserrat.variable, bodoniModa.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-border focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <JsonLd data={organizationSchema(baseUrl)} />
        <JsonLd data={websiteSchema(baseUrl)} />
        <OfflineBanner />
        <NextTopLoader
          color="var(--primary)"
          height={2}
          showSpinner={false}
          crawl={true}
          crawlSpeed={200}
          easing="ease"
          speed={400}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <QueryProvider>
              {children}
            </QueryProvider>
          </TooltipProvider>
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
