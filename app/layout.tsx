import "@/app/globals.css";
import { metatags } from "@/utils/metatags-config";
import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";
import { Providers } from "./providers";
import { Footer } from "@/components/ui/footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  ...metatags,
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <style>{`body { font-family: ${inter.style} }`}</style>
      </Head>
      <body className="flex flex-col h-screen">
        <div className="flex-grow">
          <GoogleAnalytics gaId="G-TT2T3JHPKV" />
          <Providers>{children}</Providers>
        </div>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
