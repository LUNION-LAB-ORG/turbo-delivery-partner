import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Plus_Jakarta_Sans as FontSans } from "next/font/google";

import { Providers } from "../providers/providers";

import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/providers/toast.provider";
import { Alerts } from "@/components/layout/alert-dialogs";
import NextAuthSessionProvider from "@/providers/next-auth-session.provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
    // absolute: "Lunion-Lab",
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
  // generator: "Innoplaza",
  // applicationName: "Innoplaza",
  // referrer: "origin-when-cross-origin",
  // keywords: [
  //   "immobilier",
  //   "location meublée",
  //   "location saisonnière",
  //   "location de vacances",
  //   "funished rental",
  //   "rental",
  //   "funished",
  //   "meublée",
  //   "location",
  //   "résidence",
  // ],
  // authors: [{ name: "Anderson Kouadio", url: "www.innov-immobilier.com" }],
  // creator: "Anderson Kouadio",
  // publisher: "Innov Immobilier",
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
  // },
  // category: "immobilier",
  // verification: {
  //   google: "google",
  //   yandex: "yandex",
  //   yahoo: "yahoo",
  //   other: {
  //     me: [
  //       "innoplaza@innov-immobilier.com",
  //       "00225 07 00 15 54 44",
  //       "www.innov-immobilier.com",
  //       "www.inno-plaza.com",
  //     ],
  //   },
  // },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <html suppressHydrationWarning lang="fr">
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <ToastProvider>
              {children}
              <Alerts />
            </ToastProvider>
          </Providers>
        </body>
      </html>
    </NextAuthSessionProvider>
  );
}
