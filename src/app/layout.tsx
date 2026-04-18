import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KPI Archive",
  description: "250+ KPI, 11 iş süreci kategorisi. Organizasyonunuz için doğru performans göstergelerini keşfedin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${montserrat.className} antialiased bg-gray-50`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
