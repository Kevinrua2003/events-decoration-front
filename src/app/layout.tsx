import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Providers from "@/components/auth-provider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Decorations Enterprise",
  description: "Sistema de gestión de decoración de eventos",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>        
      </body>
    </html>
  );
}
