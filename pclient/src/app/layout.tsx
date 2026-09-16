import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

import "./globals.css";

export const metadata: Metadata = {
  title: "Poste — Your social content workspace",
  description:
    "Create, schedule, publish, and learn from your social content in one calm workspace.",
};

interface RootLayoutProps {
  children: ReactNode;
}

// Provides the shared document shell and metadata for the application.
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      
      <body>
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorPrimary: "var(--primary-bright)",
              colorPrimaryForeground: "var(--button-primary-fg)",
              colorBackground: "var(--surface)",
              colorForeground: "var(--text)",
              colorInput: "var(--surface-soft)",
              colorInputForeground: "var(--text)",
              colorBorder: "var(--border-strong)",
              colorRing: "var(--primary-bright)",
              colorDanger: "var(--coral)",
              colorSuccess: "var(--secondary)",
              colorNeutral: "var(--text-muted)",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
