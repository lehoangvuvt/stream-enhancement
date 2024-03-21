import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "./registry";
import ReactQueryProvider from "@/react-query/provider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Figma For Dev",
  description: "Figma For Dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ReactQueryProvider>
            <Suspense>{children}</Suspense>
          </ReactQueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
