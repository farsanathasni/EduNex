"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { HeaderSearchProvider } from "@/components/layout/header-search";

export function Provider({children,}:{children:React.ReactNode}) {
    const [queryClient]=useState(()=>new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <HeaderSearchProvider>{children}</HeaderSearchProvider>
        </QueryClientProvider>
    )
}