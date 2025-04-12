import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { BookmarksProvider } from "@/contexts/bookmarks-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mont = localFont({
  src: "../../public/fonts/MontBold.woff",
  variable: "--font-mont",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gateway",
  description:
    "Find work from reputable opportunities approved by Lafayette High Scool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mont.variable}`}
      >
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="gateway-theme"
            disableTransitionOnChange
          >
            <BookmarksProvider>{children}</BookmarksProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
