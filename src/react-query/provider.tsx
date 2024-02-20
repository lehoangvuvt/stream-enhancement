"use client";

import { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
