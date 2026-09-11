import type { Metadata } from "next";
import type { ReactNode } from "react";

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
      <body>{children}</body>
    </html>
  );
}
