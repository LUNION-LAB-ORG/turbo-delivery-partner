"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useLocale, I18nProvider } from "@react-aria/i18n";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  let { locale, direction } = useLocale();

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <I18nProvider locale={locale}>
          <div dir={direction} lang={locale}>
            {children}
          </div>
        </I18nProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
