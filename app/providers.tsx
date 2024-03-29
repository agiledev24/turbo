"use client";
import NavBar from "@/components/NavBar";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";
import { base, polygon, mainnet } from "viem/chains";

const client = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY!,
  }),
});

export const Providers = ({ children }: any) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LivepeerConfig client={client}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            loginMethods: ["wallet", "email", "google", "farcaster"],
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              logo: "https://i.postimg.cc/k4qX3DBz/Beige-and-White-Be-Yourself-Square-Pillow-4-1.png",
              showWalletLoginFirst: false,
            },
            legal: {
              termsAndConditionsUrl: "https://your-terms-and-conditions-url",
              privacyPolicyUrl: "https://your-privacy-policy-url",
            },
            defaultChain: base,
            supportedChains: [base, polygon, mainnet],
          }}
        >
          <div className="flex flex-col items-center justify-center p-8 ">
            <NavBar />
            {children}
          </div>
        </PrivyProvider>
      </LivepeerConfig>
    </ThemeProvider>
  );
};
