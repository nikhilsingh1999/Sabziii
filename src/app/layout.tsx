import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Sabziii | Farm Fresh Organic Fruits & Vegetables",
    template: "%s | Sabziii",
  },
  description: "Order fresh organic vegetables and fruits online. Delivered straight from local farms to your doorstep in hours. Fresh, sustainable, and reliable.",
  keywords: ["organic vegetables", "fresh fruits online", "farm to table", "healthy food delivery", "sabziii shop"],
  authors: [{ name: "Sabziii Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col transition-colors duration-300">
        <AppProvider>
          <GoogleAnalytics />
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}

