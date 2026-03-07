import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { clsx } from "clsx";
import "./globals.css";
import Web3Provider from "@/components/Web3Provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tedong Silaga Arena — Predict & Win on World Chain",
  description:
    "Predict the winner of traditional Toraja buffalo matches. Earn rewards and build your streak on World Chain with World ID verification.",
  keywords: ["Tedong Silaga", "Toraja", "Prediction Market", "World Chain", "World ID", "Web3 Gaming"],
  openGraph: {
    title: "Tedong Silaga Arena — Predict & Win",
    description:
      "Digital arena for traditional Toraja buffalo matches. Predict winners, earn rewards, and climb the leaderboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={clsx(
          inter.variable,
          spaceGrotesk.variable,
          jetBrainsMono.variable,
          "antialiased"
        )}
        suppressHydrationWarning
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

