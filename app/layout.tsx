import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";

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

export const metadata: Metadata = {
  title: "Lily Waist Line | Premium Waist Trainers",
  description: "Premium waist trainers and shapewear for the modern woman. Sculpt your silhouette with luxury and confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "selection:bg-primary selection:text-primary-foreground", poppins.variable, montserrat.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#d4af37"
          height={2}
          showSpinner={false}
          crawl={true}
          crawlSpeed={200}
          easing="ease"
          speed={400}
          shadow="0 0 10px #d4af37,0 0 5px #d4af37"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
