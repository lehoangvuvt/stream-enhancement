import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import StyledComponentsRegistry from "./registry";
import ReactQueryProvider from "@/react-query/provider";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--inter" });
const rubikLines = Orbitron({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--rubik",
});

export const metadata: Metadata = {
  title: "Layout Genius",
  description: "Layout Genius",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rubikLines.variable}`}>
        <StyledComponentsRegistry>
          <ReactQueryProvider>
            <Suspense>{children}</Suspense>
          </ReactQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
