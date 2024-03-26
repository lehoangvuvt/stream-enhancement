import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import StyledComponentsRegistry from "./registry";
import ReactQueryProvider from "@/react-query/provider";
import { Suspense } from "react";
import "./globals.css";
import AuthWrapper from "@/components/auth-wrapper";

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
            <Suspense>
              <AuthWrapper>{children}</AuthWrapper>
            </Suspense>
          </ReactQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
