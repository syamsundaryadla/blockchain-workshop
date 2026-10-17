import type { Metadata } from "next";
import { IBM_Plex_Sans, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./studio.css";
import "./studio-labs.css";
import "./workshop-deck.css";
import "./campus-workshop.css";
import "./fabric-workshop.css";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blockchain Lab — Hyperledger Fabric Workshop",
  description:
    "A visual, interactive 10–4 beginner workshop. Understand blockchain and Hyperledger Fabric, then build Campus Credits Transfer.",
  keywords: [
    "Blockchain",
    "Campus Credits Transfer",
    "Interactive Simulation",
    "SHA-256",
    "Smart Contracts",
    "Hyperledger Fabric",
    "JavaScript Chaincode",
    "Engineering Workshop",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-text antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
