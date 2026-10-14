import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BLOCKCHAIN LAB — Interactive Blockchain Workshop Experience",
  description:
    "An interactive presentation and simulation platform for technical blockchain education. From SHA-256 fundamentals and network topologies to Hyperledger Fabric enterprise engineering.",
  keywords: [
    "Blockchain",
    "Hyperledger Fabric",
    "Interactive Simulation",
    "SHA-256",
    "Smart Contracts",
    "Chaincode",
    "Docker",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-background text-text antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
