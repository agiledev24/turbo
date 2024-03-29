import { Metadata } from "next";

const title = "VPM - Custom Visuals for Creative";
const description =
  "VPM gives creatives the tools to make high quality visuals quickly for story and mood boards, social, performances, and events";
const url = "https://vpmlaunchfront-rho.vercel.app/";

export const metatags: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  openGraph: {
    title,
    description,
    url: url,
    siteName: title,
    images: {
      url: "/og-image.png",
      width: 1200,
      height: 630,
    },
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: {
      url: "/og-image.png",
      alt: "VPM",
    },
  },
};
