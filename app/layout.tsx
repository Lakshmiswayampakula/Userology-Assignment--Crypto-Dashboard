import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SoundProvider } from "@/components/sound-provider";
import { Header } from "@/components/ui/header";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
};

export const metadata: Metadata = {
  title: "Coin Cash - Financial Dashboard",
  description: "A comprehensive financial dashboard with weather and cryptocurrency data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SoundProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 py-6">
                <div className="w-full h-full rounded-xl">
                  {children}
                </div>
              </main>
            </div>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
