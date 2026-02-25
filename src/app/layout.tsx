import type { Metadata } from "next";
// 1. Importujeme oba fonty
import { Outfit, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// 2. Nakonfigurujeme Outfit (hlavný font)
const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

// 3. Nakonfigurujeme Roboto Condensed (doplnkový font)
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  weight: ["300", "400", "700"], // Načítame rôzne hrúbky
});

export const metadata: Metadata = {
  title: "xVisual",
  description: "Visual Feedback Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 4. Pridáme obe premenné do <html>
    <html lang="en" className={`${outfit.variable} ${robotoCondensed.variable} dark`}>
      <body className="font-sans antialiased bg-black text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}