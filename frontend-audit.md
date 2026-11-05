# EduNex Frontend Audit
Generated: 11/03/2026 14:53:42
Total files: 83


# FILE: apps\web\next-env.d.ts
```
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";
import "./.next/dev/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```


# FILE: apps\web\next.config.ts
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```


# FILE: apps\web\package.json
```
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.9.1",
    "@tanstack/react-query": "^5.104.2",
    "axios": "^1.20.0",
    "better-auth": "^1.7.7",
    "lucide-react": "^1.61.0",
    "next": "16.3.8",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-hook-form": "^7.89.0",
    "react-phone-number-input": "^3.4.18",
    "zod": "^4.6.5",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.8",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "packageManager": "pnpm@12.9.1"
}
```


# FILE: apps\web\tsconfig.json
```
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```


# FILE: apps\web\app\globals.css
```
@import "tailwindcss";

@theme {
  /* Colors */

  /* Primary */
  --color-primary: #234c96;
  --color-primary-hover: #1a3a73;
  --color-primary-subtle: #ebf0fa;
  --color-primary-foreground: #ffffff;

  /* Brand wash for auth screens. Stays navy in both themes. */
  --color-brand: #234c96;

  /* Secondary */
  --color-secondary: #f5f7fc;
  --color-secondary-hover: #e4e9f5;
  --color-secondary-subtle: #fafbfe;
  --color-secondary-foreground: #234c96;

  /* Accent */
  --color-accent: #F28520; 
  --color-accent-hover: #D96F12;
  --color-accent-subtle: #feeae5;
  --color-accent-foreground: #ffffff;

  /* Neutral / Surface */
  --color-background: #f5f7fc;
  --color-surface: #ffffff;
  --color-surface-raised: #ffffff;
  --color-surface-overlay: #ffffff;
  --color-border: #d1d9ee;
  --color-border-subtle: #e8ecf7;

  /* Text */
  --color-text: #111827;
  --color-text-muted: #4b5a7a;
  --color-text-subtle: #8a97b4;
  --color-text-inverse: #ffffff;  
  --color-text-on-primary: #ffffff;

  /* Legacy names used by headers and notifications */
  --color-inkwell: #111827;
  --color-mist-gray: #4b5a7a;
  --color-cloud-white: #ffffff;
  --color-skyline-gray: #e4e9f5;
  --color-horizon-gray: #f5f7fc;

  /* Typography */
  --font-roobert:
    "Roobert", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;

  /* Typography  */

  --text-label: 0.875rem; /* 14px */
  --leading-label: 1.5;
  
  --text-caption: 0.8125rem;
  --leading-caption: 1.4;

  --text-body: 1rem;
  --leading-body: 1.6;

  --text-body-lg: 1.125rem;
  --leading-body-lg: 1.7;

  --text-subheading: 1.25rem;
  --leading-subheading: 1.5;

  --text-heading-lg: clamp(1.75rem, 5vw, 2rem);
  --leading-heading-lg: 1.2;

  --text-heading: clamp(1.5rem, 4vw, 1.75rem);
  --leading-heading: 1.3;

  --text-heading-sm: clamp(1.25rem, 3vw, 1.5rem);
  --leading-heading-sm: 1.35;

  --text-display-lg: clamp(3.5rem, 5.5vw, 5.25rem);
  --leading-display-lg: 1.05;

  --text-display: clamp(2.5rem, 4vw, 3.5rem);
  --leading-display: 1.1;

  --text-display-sm: clamp(1.5rem, 2.5vw, 2.5rem);
  --leading-display-sm: 1.15;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 32px;
  --radius-3xl-2: 40px;
  --radius-full: 48px;
  --radius-full-2: 60px;
  --radius-full-3: 100px;

  /* Shadows */
  --shadow-subtle:
    rgba(0, 0, 0, 0.07) 0px 1px 1px 0px,
    rgba(0, 0, 0, 0.04) 0px -1px 1px 0px inset,
    rgba(0, 0, 0, 0.14) 0px 0px 0px 0.5px inset;
  --shadow-lg: rgba(0, 0, 0, 0.04) 0px 20px 20px -8px;

  --animate-skeleton-shimmer: skeleton-shimmer 1.6s ease-in-out infinite;
}
```


# FILE: apps\web\app\layout.tsx
```
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
title: "EduNex",
description: "EduNex Campus Management System",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
```


# FILE: apps\web\app\page.tsx
```

import Link from "next/link";

const features = [
  {
    icon: "ðŸ“š",
    title: "Study Materials",
    description:
      "Access notes, learning resources, and study materials shared by your faculty.",
  },
  {
    icon: "ðŸ“…",
    title: "Campus Events",
    description:
      "Discover upcoming campus events, club activities, and student programs.",
  },
  {
    icon: "ðŸŽ­",
    title: "Clubs & Activities",
    description:
      "Explore campus clubs, request membership, and participate in activities.",
  },
  {
    icon: "ðŸ’¬",
    title: "Study Groups",
    description:
      "Connect with classmates, create study groups, and learn together.",
  },
  {
    icon: "ðŸ› ï¸",
    title: "Issue Reporting",
    description:
      "Report campus-related issues and track their status in one place.",
  },
  {
    icon: "ðŸ”Ž",
    title: "Lost & Found",
    description:
      "Report lost belongings and browse items reported found on campus.",
  },
];

const campusServices = [
  {
    icon: "ðŸ“š",
    title: "Learning",
    description: "Resources & notes",
    color: "bg-primary-subtle text-primary",
  },
  {
    icon: "ðŸŽ­",
    title: "Community",
    description: "Clubs & activities",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: "ðŸ“…",
    title: "Events",
    description: "Campus happenings",
    color: "bg-accent-subtle text-accent",
  },
  {
    icon: "ðŸ‘¥",
    title: "Study Groups",
    description: "Learn together",
    color: "bg-secondary text-secondary-foreground",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
              E
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Edu<span className="text-primary">Nex</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-text-muted md:flex">
            <a href="#home" className="transition hover:text-primary">
              Home
            </a>
            <a href="#features" className="transition hover:text-primary">
              Features
            </a>
            <a href="#about" className="transition hover:text-primary">
              About
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-secondary hover:text-primary sm:px-4"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover sm:px-4"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative scroll-mt-24 overflow-hidden px-6 py-20 sm:py-28 lg:px-10"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary-subtle blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-accent-subtle blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Your campus, connected
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              One platform.
              <br />
              Endless campus{" "}
              <span className="text-primary">possibilities.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              Welcome to EduNex â€” your digital campus for learning resources,
              events, clubs, study groups, and campus services, all in one
              convenient place.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Get Started
                <span aria-hidden="true">â†’</span>
              </Link>

              <Link
                href="/login"
                className="rounded-xl border border-border bg-surface px-6 py-3.5 font-semibold text-text-muted transition hover:border-primary hover:text-primary"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <span className="font-bold text-primary">âœ“</span>
                Easy access to resources
              </span>

              <span className="flex items-center gap-2">
                <span className="font-bold text-primary">âœ“</span>
                Connected campus community
              </span>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-4 rounded-3xl bg-primary-subtle blur-2xl" />

            <div className="relative rounded-3xl border border-border bg-surface p-5 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-border-subtle pb-5">
                <div>
                  <p className="text-sm text-text-muted">Welcome to</p>
                  <h2 className="mt-1 text-xl font-bold">
                    Your Campus Hub
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-2xl">
                  ðŸŽ“
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {campusServices.map((service) => (
                  <div
                    key={service.title}
                    className={`rounded-2xl p-5 ${service.color}`}
                  >
                    <span className="text-3xl">{service.icon}</span>

                    <p className="mt-4 font-semibold">{service.title}</p>

                    <p className="mt-1 text-sm opacity-80">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-inkwell p-5 text-text-inverse">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                  âœ¨
                </div>

                <div>
                  <p className="font-semibold">
                    Everything in one place
                  </p>

                  <p className="mt-1 text-sm opacity-75">
                    A smarter way to experience campus life.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-1/3 hidden rounded-xl border border-border bg-surface p-3 shadow-lg sm:block">
              <span className="text-xl">ðŸ’¡</span>
            </div>

            <div className="absolute -right-3 bottom-10 hidden rounded-xl border border-border bg-surface p-3 shadow-lg sm:block">
              <span className="text-xl">ðŸš€</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 border-y border-border-subtle bg-surface px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              What EduNex offers
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your campus needs
            </h2>

            <p className="mt-4 leading-7 text-text-muted">
              Explore the tools that help students stay informed, connected,
              and involved in campus life.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-border bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-3xl transition group-hover:bg-secondary">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-text-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About / Call to Action */}
      <section
        id="about"
        className="scroll-mt-20 px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-7 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <span className="text-4xl">ðŸŽ“</span>

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Make your campus experience better.
            </h2>

            <p className="mt-5 leading-7 opacity-85">
              Join your campus community on EduNex and keep your academic
              resources and campus activities within reach.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 font-semibold text-primary transition hover:bg-secondary"
            >
              Create Your Account
              <span aria-hidden="true">â†’</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-6 py-7 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="text-xl font-bold">
            Edu<span className="text-primary">Nex</span>
          </Link>

          <p className="text-center text-sm text-text-muted">
            Connecting students, faculty, and campus communities.
          </p>

          <p className="text-sm text-text-muted">
            Â© {new Date().getFullYear()} EduNex
          </p>
        </div>
      </footer>
    </main>
  );
}
```


# FILE: apps\web\app\provider.tsx
```
"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import{useState} from "react";

export function Provider({children,}:{children:React.ReactNode}) {
    const [queryClient]=useState(()=>new QueryClient())

    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
```


# FILE: apps\web\app\(app)\layout.tsx
```
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { useAccess } from "@/lib/navigation/access";
import { ModeSwitch } from "@/components/layout/mode-switch";

// One layout for every role. The sidebar is built from lib/nav.ts,
// filtered by the roles and permissions in /api/me.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { me, isPending, isError, error, refetch, unauthorized, navItems, mode, canSwitchMode } =
    useAccess();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (unauthorized) router.replace("/login");
  }, [unauthorized, router]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      queryClient.clear();
      router.replace("/login");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending || unauthorized) {
    return <p className="p-10 text-text-muted">Checking session...</p>;
  }

  if (isError || !me) {
    return (
      <section className="m-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">Unable to load your account</h2>
        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </section>
    );
  }

  const portalLabel = canSwitchMode
    ? mode === "coordinator"
      ? "Coordinator view"
      : "Student view"
    : me.roles.map((r) => r.name ?? r.slug).join(", ");

  return (
    <div className="min-h-screen bg-background text-text md:flex">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">EduNex</h1>
          <p className="mt-1 text-sm text-text-muted">{portalLabel}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                <span className="w-5 text-center text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition hover:bg-background disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg border border-border px-3 py-2 md:hidden"
          >
            â˜°
          </button>

          <div className="flex-1">
            <p className="font-semibold">{me.user?.name ?? "User"}</p>
<p className="text-xs text-text-muted">{me.user?.email ?? ""}</p>
          </div>

          <ModeSwitch />
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
```


# FILE: apps\web\app\(app)\dashboard\page.tsx
```
"use client";

import { useAccess } from "@/lib/navigation/access";
import Link from "next/link";



// One dashboard for every role: the cards are the sidebar pages the
// current user is allowed to open (same source: lib/nav.ts).
export default function DashboardPage() {
  const { me, navItems, mode, canSwitchMode } = useAccess();

  if (!me) return null;

  const cards = navItems.filter((item) => item.href !== "/dashboard");

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          {canSwitchMode
            ? mode === "coordinator"
              ? "Coordinator workspace"
              : "Student workspace"
            : "Your workspace"}
        </p>

        <h1 className="mt-2 text-3xl font-bold">Welcome, {me.user?.name ?? "User"}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {me.roles.map((role) => (
            <span
              key={role.slug}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted"
            >
              {role.name ?? role.slug}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Quick access</h2>

        {cards.length === 0 ? (
          <p className="text-sm text-text-muted">
            No pages are available for your account yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="font-semibold">{item.label}</h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {item.description}
                  </p>
                )}
                <p className="mt-4 text-sm font-semibold text-primary">
                  Open page â†’
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
```


# FILE: apps\web\app\(auth)\club-coordinator-login\page.tsx
```

import RoleLoginForm from "@/features/auth/components/role-login-form";

export default function ClubCoordinatorLoginPage() {
  return (
    <RoleLoginForm
      title="Club Coordinator Login"
      description="Sign in to manage your clubs, events, and activities."
      dashboardPath="/club-coordinator/dashboard"
    />
  );
}
```


# FILE: apps\web\app\(auth)\forgettPassword\page.tsx
```
export default function ForgetPasswordPage() {
  return (
    <div>
      <h1>Forgot Password</h1>
      <p>Password reset page is not implemented yet.</p>
    </div>
  );
}
```


# FILE: apps\web\app\(auth)\login\page.tsx
```
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { LoginFormValues, loginSchema } from "@/features/auth/validation/login-schema";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setServerError("");

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setServerError(error.message || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError(
        "Unable to log in. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            E
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-text">
            Welcome to EduNex
          </h1>

          <p className="mt-2 text-sm text-text-muted">
            Sign in to access your campus dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-text"
            >
              Email address
            </label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className="w-full"
            />

            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text"
            >
              Password
            </label>

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
              className="w-full"
            />

            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Dont have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-5 border-t border-border-subtle pt-5 text-center">
          <p className="text-sm text-text-muted">
            Are you a teacher?{" "}
            <Link
              href="/teacher-login"
              className="font-semibold text-primary hover:underline"
            >
              Teacher Login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-text-subtle">
          Â© {new Date().getFullYear()} EduNex Campus Management
        </p>
      </Card>
    </main>
  );
}
```


# FILE: apps\web\app\(auth)\register\page.tsx
```
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import {
  RegisterFormValues,
  registerSchema,
} from "@/features/auth/validation/register-schema";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function handleRegister(values: RegisterFormValues) {
    setMessage("");
    setIsSuccess(false);

    try {
      const { error } = await authClient.signUp.email({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setMessage(error.message || "Registration failed.");
        return;
      }

      setIsSuccess(true);
      setMessage("Account created successfully!");

      router.push("/studentprofile");
    } catch {
      setMessage("Unable to connect to the server. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg border border-border bg-surface p-6 shadow-lg sm:p-10">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            E
          </div>

          <div>
            <h1 className="text-2xl font-bold text-text">EduNex</h1>
            <p className="text-xs tracking-wider text-text-muted">
              CAMPUS MANAGEMENT
            </p>
          </div>
        </Link>

        <h2 className="text-heading font-bold text-text">
          Create your account
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Join your campus community.
        </p>

        <form
          onSubmit={handleSubmit(handleRegister)}
          noValidate
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-text"
            >
              Full name
            </label>

            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              className="w-full"
            />

            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-text"
            >
              Email address
            </label>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className="w-full"
            />

            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text"
            >
              Password
            </label>

            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              {...register("password")}
              className="w-full"
            />

            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {message && (
            <p
              role={isSuccess ? "status" : "alert"}
              className={`rounded-xl border p-3 text-sm ${
                isSuccess
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
```


# FILE: apps\web\app\(auth)\resetPassword\page.tsx
```
"use client";

import { Suspense } from "react";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc]">
          <p className="text-gray-600">Loading reset password page...</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
```


# FILE: apps\web\app\(auth)\teacher-login\page.tsx
```

import RoleLoginForm from "@/features/auth/components/role-login-form";

export default function TeacherLoginPage() {
  return (
    <RoleLoginForm
      title="Teacher Login"
      description="Sign in to manage your classes and academic activities."
      dashboardPath="/teacher/dashboard"
    />
  );
}
```


# FILE: apps\web\app\(club)\clubs\page.tsx
```
import ClubManagementView from "@/features/clubs/components/club-management-view";

export default function ClubsPage() {
  return <ClubManagementView />;
}
```


# FILE: apps\web\app\(club)\student\page.tsx
```
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStudentClubsQuery } from "@/features/clubs/api/club-query";
import ClubCard from "@/features/clubs/components/club-card";
import PageHeader from "@/components/ui/page-header";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";


export default function StudentClubsPage() {
  const [search, setSearch] = useState("");
  const {
    data: clubs = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubsQuery();

  const filteredClubs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return clubs.filter(
      (club) =>
        club.name.toLowerCase().includes(term) ||
        (club.description ?? "").toLowerCase().includes(term),
    );
  }, [clubs, search]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
  href="/studentDashboard"
  className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-text-muted shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
>
  <span aria-hidden="true">â†</span>
  Back to Dashboard
</Link>
        <header className="mt-2 overflow-hidden rounded-3xl bg-brand p-8 text-text-inverse sm:p-10">          <p className="text-label font-semibold uppercase tracking-[0.2em] text-white/75">
            EduNex Â· Campus Life
          </p>

          <h1 className="mt-3 text-display-sm font-extrabold tracking-tight">
            Discover Your Clubs
          </h1>

          <p className="mt-3 max-w-xl text-body leading-relaxed text-white/85">
            Explore your interests, meet new people, and find your campus
            community.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              title="Explore clubs"
              description={`${clubs.length} clubs available`}
            />

            <div className="w-full sm:max-w-sm">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clubs..."
                aria-label="Search clubs"
              />
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-5 w-2/3 rounded bg-secondary" />
                <div className="mt-4 h-4 rounded bg-secondary" />
                <div className="mt-2 h-4 w-4/5 rounded bg-secondary" />
                <div className="mt-6 h-10 rounded-lg bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card className="mt-8 text-center">
            <p className="text-text">
              Unable to load clubs.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 font-semibold text-primary hover:text-primary-hover"
            >
              Try again
            </button>
          </Card>
        )}

        {!isLoading && !isError && (
          filteredClubs.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <Card className="mt-8 border-dashed py-12 text-center">
              <h2 className="text-subheading font-bold text-text">
                No clubs found
              </h2>
              <p className="mt-2 text-label text-text-muted">
                {search.trim()
                  ? "Try a different search term."
                  : "There are no clubs available yet."}
              </p>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-label font-semibold text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </Card>
          )
        )}

        <div className="mt-8 flex justify-end">
          <Link
            href="/student/my-memberships"
            className="text-label font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            View my membership requests â†’
          </Link>
        </div>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(club)\student\my-memberships\page.tsx
```
"use client";

import Link from "next/link";
import { useMyStudentMembershipRequestsQuery } from "@/features/clubs/api/club-query";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import PageHeader from "@/components/ui/PageHeader";

export default function MyMembershipsPage() {
  const {
    data: memberships = [],
    isLoading,
    isError,
    refetch,
  } = useMyStudentMembershipRequestsQuery();

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/clubs"
          className="text-label font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          â† Back to clubs
        </Link>

        <div className="mt-6">
          <PageHeader
            eyebrow="Campus Life"
            title="My Membership Requests"
            description="Track the status of your club applications."
          />
        </div>

        {isLoading && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-5 w-1/3 rounded bg-secondary" />
                <div className="mt-3 h-4 w-1/4 rounded bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <Card className="mt-6">
            <p className="text-text">
              Unable to load membership requests.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-label font-semibold text-primary hover:underline"
            >
              Try again
            </button>
          </Card>
        )}

        {!isLoading && !isError && (
          <div className="mt-6 space-y-4">
            {memberships.length === 0 ? (
              <Card className="border-dashed py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-xl text-primary">
                  âœ¦
                </div>

                <h2 className="mt-4 text-subheading font-bold text-text">
                  No membership requests yet
                </h2>

                <p className="mt-2 text-label text-text-muted">
                  Explore clubs and send your first membership request.
                </p>

                <div className="mt-5 flex justify-center">
                  <Link href="/clubs">
                    <Button>Explore clubs</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              memberships.map((membership) => (
                <Card
                  key={membership.id}
                  className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h2 className="text-body font-bold text-text">
                      {membership.club?.name ??
                        `Club #${membership.clubId}`}
                    </h2>

                    <p className="mt-1 text-caption text-text-muted">
                      Request ID: {membership.id}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-border bg-secondary px-4 py-2 text-caption font-semibold capitalize text-secondary-foreground">
                    {membership.status}
                  </span>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(club)\student\[clubId]\page.tsx
```
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {useCreateStudentMembershipRequestMutation,useMyStudentMembershipRequestsQuery,useStudentClubByIdQuery,} from "../../../../features/clubs/api/club-query";

const quickLinks = [
  {
    title: "Club Events",
    description: "Discover activities, workshops, and upcoming events.",
    icon: "ðŸ“…",
    href: "events",
    accent: "bg-blue-100 text-blue-700",
    number: "01",
  },
  {
    title: "Announcements",
    description: "Stay updated with the latest club news and notices.",
    icon: "ðŸ“¢",
    href: "announcement",
    accent: "bg-orange-100 text-orange-700",
    number: "02",
  },
  {
    title: "Coordinators",
    description: "Connect with the people leading your club.",
    icon: "ðŸ‘¥",
    href: "coordinators",
    accent: "bg-emerald-100 text-emerald-700",
    number: "03",
  },
];

export default function ClubDetailsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: club,
    isLoading,
    isError,
    refetch,
  } = useStudentClubByIdQuery(clubId);

  const { data: memberships = [] } =
    useMyStudentMembershipRequestsQuery();

  const membershipMutation =
    useCreateStudentMembershipRequestMutation();

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-8 text-text">
        Invalid club ID.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-secondary" />
          <div className="h-64 rounded-3xl bg-secondary" />
          <div className="grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-48 rounded-2xl bg-secondary" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError || !club) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 text-text">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-surface p-8 text-center">
          <div className="text-4xl">ðŸ«</div>
          <h1 className="mt-4 text-xl font-bold">Unable to load this club</h1>
          <p className="mt-2 text-sm text-text-muted">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const membership = memberships.find(
    (item) => item.clubId === clubId,
  );

  const status = membership?.status?.toLowerCase();
  const alreadyRequested = Boolean(membership);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/student"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">â†</span>
          All clubs
        </Link>

        {/* Hero section */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-primary text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-1/4 h-56 w-56 rounded-full bg-white/5"
          />

          <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                EDUNEX CAMPUS COMMUNITY
              </div>

              <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Welcome to
                <span className="mt-1 block break-words text-blue-100">
                  {club.name}
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                {club.description ||
                  "Find your community, discover new interests, and make your campus experience more meaningful."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {alreadyRequested ? (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-primary">
                    <span aria-hidden="true">âœ“</span>
                    {status === "approved"
                      ? "Membership approved"
                      : status === "rejected"
                        ? "Request rejected"
                        : "Request submitted"}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={membershipMutation.isPending}
                    onClick={() => membershipMutation.mutate(clubId)}
                    className="rounded-xl bg-white px-6 py-3.5 font-bold text-primary shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {membershipMutation.isPending
                      ? "Sending request..."
                      : "Join this club  â†’"}
                  </button>
                )}

                <Link
                  href={`/student/${clubId}/events`}
                  className="rounded-xl border border-white/30 bg-white/10 px-5 py-3.5 font-semibold text-white transition hover:bg-white/20"
                >
                  Explore events
                </Link>
              </div>

              {membershipMutation.isError && (
                <p role="alert" className="mt-4 text-sm text-red-100">
                  {membershipMutation.error instanceof Error
                    ? membershipMutation.error.message
                    : "Unable to submit your request. Please try again."}
                </p>
              )}

              {membershipMutation.isSuccess && (
                <p role="status" className="mt-4 text-sm font-medium text-white">
                  âœ“ Your membership request was submitted successfully.
                </p>
              )}
            </div>

            <div className="hidden lg:flex lg:justify-center">
              <div className="flex h-52 w-52 items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm">
                âœ¦
              </div>
            </div>
          </div>
        </section>

        {/* Section heading */}
        <section className="mt-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Explore your community
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
                Everything in one place
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
                Find events, get important updates, and connect with your club team.
              </p>
            </div>

            <span className="mt-2 text-sm font-medium text-text-subtle sm:mt-0">
              Your campus, your community.
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={`/student/${clubId}/${item.href}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${item.accent}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold tracking-widest text-text-subtle">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-text transition group-hover:text-primary">
                  {item.title}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-text-muted">
                  {item.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
                  <span className="text-sm font-bold text-primary">
                    Explore
                  </span>
                  <span className="transition group-hover:translate-x-1" aria-hidden="true">
                    â†’
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Membership callout */}
        <section className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-2xl">
              ðŸŽ“
            </div>
            <div>
              <h2 className="font-bold text-text">
                Be part of something bigger
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-text-muted">
                Join the club to participate in its community and stay connected with campus activities.
              </p>
            </div>
          </div>

          {!alreadyRequested && (
            <button
              type="button"
              disabled={membershipMutation.isPending}
              onClick={() => membershipMutation.mutate(clubId)}
              className="shrink-0 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {membershipMutation.isPending
                ? "Sending..."
                : "Request membership"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(club)\student\[clubId]\announcement\page.tsx
```
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubAnnouncementsQuery } from "@/features/clubs/api/club-query";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";

export default function ClubAnnouncementsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: announcements = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubAnnouncementsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-6 text-text">
        Invalid club ID.
      </main>
    );
  }

  const formatDate = (value?: string) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/student/${clubId}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">â†</span>
          Back to club
        </Link>

        {/* Hero banner */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-primary text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[38px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/4 h-48 w-48 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center lg:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-orange-300" />
                Stay informed
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Every update.
                <span className="block text-blue-100">
                  All in one place.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Stay connected with your club through important notices,
                exciting updates, and the latest campus news.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                <span aria-hidden="true">ðŸ“£</span>
                Never miss an important update
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center md:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-xl backdrop-blur-sm lg:h-44 lg:w-44 lg:text-8xl">
                ðŸ“¢
              </div>
            </div>
          </div>
        </section>

        {/* Page heading */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              eyebrow="Club communication"
              title="Latest Announcements"
              description="Important information and updates shared by your club."
            />

            {!isLoading && !isError && (
              <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 shadow-subtle">
                <p className="text-2xl font-extrabold text-primary">
                  {String(announcements.length).padStart(2, "0")}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {announcements.length === 1
                    ? "Announcement"
                    : "Announcements"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-secondary" />
                  <div className="flex-1">
                    <div className="h-5 w-3/4 rounded bg-secondary" />
                    <div className="mt-3 h-4 w-1/3 rounded bg-secondary" />
                  </div>
                </div>
                <div className="mt-5 h-4 w-full rounded bg-secondary" />
                <div className="mt-2 h-4 w-4/5 rounded bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <Card className="mt-6 py-10 text-center">
            <div className="text-4xl">ðŸ“¡</div>
            <h2 className="mt-4 text-xl font-bold text-text">
              Updates are temporarily unavailable
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !isError && announcements.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-subtle text-4xl">
              ðŸ“­
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-text">
              You're all caught up!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
              There are no announcements yet. New club notices and updates
              will appear here when they are published.
            </p>

            <Link
              href={`/student/${clubId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Back to club
              <span aria-hidden="true">â†’</span>
            </Link>
          </div>
        )}

        {/* Announcement cards */}
        {!isLoading && !isError && announcements.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {announcements.map((announcement, index) => {
              const publishedDate = formatDate(announcement.createdAt);
              const content =
                announcement.content ||
                announcement.message ||
                "No additional details are available.";

              return (
                <article
                  key={announcement.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="h-1.5 bg-accent transition-colors group-hover:bg-primary" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                          index % 3 === 0
                            ? "bg-blue-100"
                            : index % 3 === 1
                              ? "bg-orange-100"
                              : "bg-emerald-100"
                        }`}
                      >
                        {index % 3 === 0
                          ? "ðŸ“¢"
                          : index % 3 === 1
                            ? "ðŸ“Œ"
                            : "âœ¦"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Club update
                        </span>

                        <h2 className="mt-2 break-words text-lg font-extrabold leading-snug text-text transition group-hover:text-primary sm:text-xl">
                          {announcement.title}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-text-muted">
                      {content}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                        <span aria-hidden="true">ðŸ—“ï¸</span>
                        <span>
                          {publishedDate
                            ? `Published ${publishedDate}`
                            : "Club announcement"}
                        </span>
                      </div>

                      <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-bold text-accent-hover">
                        Official update
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-border-subtle py-6 text-center">
          <p className="text-sm text-text-muted">
            Stay connected with your campus community
            <span className="mx-2 text-primary">âœ¦</span>
            EduNex
          </p>
        </footer>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(club)\student\[clubId]\coordinators\page.tsx
```
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubCoordinatorsQuery } from "@/features/clubs/api/club-query";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";

const avatarStyles = [
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

export default function ClubCoordinatorsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: coordinators = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubCoordinatorsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-6 text-text">
        Invalid club ID.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/student/${clubId}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">â†</span>
          Back to club
        </Link>

        {/* Hero banner */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-primary text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[38px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center lg:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                The people behind the club
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Meet your team.
                <span className="block text-blue-100">
                  Make great things happen.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Get to know the coordinators who help organize activities,
                support members, and bring your campus community together.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                <span aria-hidden="true">ðŸ¤</span>
                Your club team is here to help
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center md:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-xl backdrop-blur-sm lg:h-44 lg:w-44 lg:text-8xl">
                ðŸ‘¥
              </div>
            </div>
          </div>
        </section>

        {/* Page heading */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              eyebrow="Meet the team"
              title="Club Coordinators"
              description="Connect with the people coordinating your club activities."
            />

            {!isLoading && !isError && (
              <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 shadow-subtle">
                <p className="text-2xl font-extrabold text-primary">
                  {String(coordinators.length).padStart(2, "0")}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {coordinators.length === 1
                    ? "Coordinator"
                    : "Coordinators"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="animate-pulse p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-secondary" />
                  <div className="flex-1">
                    <div className="h-5 w-3/4 rounded bg-secondary" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-secondary" />
                  </div>
                </div>
                <div className="mt-6 h-10 rounded-xl bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <Card className="mt-6 py-10 text-center">
            <div className="text-4xl">ðŸ˜•</div>
            <h2 className="mt-4 text-xl font-bold text-text">
              Unable to load coordinators
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !isError && coordinators.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-subtle text-4xl">
              ðŸ‘¥
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-text">
              Your team is coming soon!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
              Coordinator details haven't been added yet. Please check back
              later for information about your club team.
            </p>

            <Link
              href={`/student/${clubId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Back to club
              <span aria-hidden="true">â†’</span>
            </Link>
          </div>
        )}

        {/* Coordinator cards */}
        {!isLoading && !isError && coordinators.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coordinators.map((coordinator, index) => {
              const initials = coordinator.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("");

              const avatarStyle =
                avatarStyles[index % avatarStyles.length];

              return (
                <article
  key={`${coordinator.id}-${coordinator.email ?? coordinator.name}-${index}`}
  className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
>
                  <div className="h-1.5 bg-primary/80 transition-colors group-hover:bg-accent" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-extrabold shadow-sm ${avatarStyle}`}
                      >
                        {initials || "CC"}
                      </div>

                      <span className="rounded-full bg-primary-subtle px-3 py-1.5 text-xs font-bold text-primary">
                        Coordinator
                      </span>
                    </div>

                    <h2 className="mt-6 break-words text-xl font-extrabold text-text transition group-hover:text-primary">
                      {coordinator.name}
                    </h2>

                    <p className="mt-2 text-sm text-text-muted">
                      Club Coordinator
                    </p>

                    <div className="mt-5 border-t border-border-subtle pt-4">
                      {coordinator.email ? (
                        <a
                          href={`mailto:${coordinator.email}`}
                          className="flex min-w-0 items-center gap-3 rounded-xl bg-secondary-subtle p-3 transition hover:bg-primary-subtle"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                            âœ‰
                          </span>

                          <span className="min-w-0">
                            <span className="block text-xs font-medium text-text-subtle">
                              Email address
                            </span>
                            <span className="mt-1 block break-all text-sm font-semibold text-text">
                              {coordinator.email}
                            </span>
                          </span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 rounded-xl bg-secondary-subtle p-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-text-muted">
                            âœ‰
                          </span>
                          <p className="text-sm text-text-muted">
                            Contact details unavailable
                          </p>
                        </div>
                      )}
                    </div>

                    {coordinator.email && (
                      <a
                        href={`mailto:${coordinator.email}`}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                      >
                        Contact coordinator
                        <span aria-hidden="true">â†’</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-border-subtle py-6 text-center">
          <p className="text-sm text-text-muted">
            Stronger together, better together
            <span className="mx-2 text-primary">âœ¦</span>
            EduNex
          </p>
        </footer>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(club)\student\[clubId]\events\page.tsx
```
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStudentClubEventsQuery } from "@/features/clubs/api/club-query";
import PageHeader from "@/components/ui/page-header";
import Card from "@/components/ui/card";

export default function ClubEventsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = Number(params.clubId);

  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
  } = useStudentClubEventsQuery(clubId);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    return (
      <main className="min-h-screen bg-background p-6 text-text">
        Invalid club ID.
      </main>
    );
  }

  const formatEventDate = (value?: string) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return {
      day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
      month: date.toLocaleDateString("en-IN", { month: "short" }),
      year: date.toLocaleDateString("en-IN", { year: "numeric" }),
      full: date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-text sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/student/${clubId}`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
        >
          <span aria-hidden="true">â†</span>
          Back to club
        </Link>

        {/* Hero banner */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] bg-primary text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-white/5"
          />

          <div className="relative flex flex-col justify-between gap-8 p-7 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Campus life
              </span>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Make memories.
                <span className="block text-blue-100">
                  Be part of the action.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Discover club activities, meet new people, and find exciting
                opportunities happening on your campus.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                <span aria-hidden="true">âœ¦</span>
                Your next campus experience starts here
              </div>
            </div>

            <div className="hidden shrink-0 items-center justify-center md:flex">
              <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-7xl shadow-xl backdrop-blur-sm lg:h-44 lg:w-44 lg:text-8xl">
                ðŸŽ‰
              </div>
            </div>
          </div>
        </section>

        {/* Events heading */}
        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <PageHeader
              eyebrow="What's happening"
              title="Club Events"
              description="Explore activities and events organized by your club."
            />

            {!isLoading && !isError && (
              <div className="w-fit rounded-xl border border-border bg-surface px-4 py-3 shadow-subtle">
                <p className="text-2xl font-extrabold text-primary">
                  {events.length.toString().padStart(2, "0")}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {events.length === 1 ? "Event listed" : "Events listed"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="animate-pulse">
                <div className="h-4 w-24 rounded bg-secondary" />
                <div className="mt-5 h-6 w-3/4 rounded bg-secondary" />
                <div className="mt-4 h-4 w-full rounded bg-secondary" />
                <div className="mt-2 h-4 w-2/3 rounded bg-secondary" />
                <div className="mt-6 h-10 w-28 rounded-xl bg-secondary" />
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card className="mt-6 border-red-200 py-10 text-center">
            <div className="text-4xl">ðŸ˜•</div>
            <h2 className="mt-4 text-xl font-bold text-text">
              Events couldn't be loaded
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </Card>
        )}

        {/* Empty state */}
        {!isLoading && !isError && events.length === 0 && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-subtle text-4xl">
              ðŸ“…
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-text">
              Something exciting is on the way!
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
              There are no events scheduled right now. Check back soon for
              workshops, activities, and club gatherings.
            </p>
            <Link
              href={`/student/${clubId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
            >
              Explore your club
              <span aria-hidden="true">â†’</span>
            </Link>
          </div>
        )}

        {/* Event cards */}
        {!isLoading && !isError && events.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {events.map((event, index) => {
              const rawDate = event.startDate || event.date;
              const formattedDate = formatEventDate(rawDate);
              const colors = [
                "bg-blue-100 text-blue-700",
                "bg-orange-100 text-orange-700",
                "bg-emerald-100 text-emerald-700",
                "bg-violet-100 text-violet-700",
              ];
              const color = colors[index % colors.length];

              return (
                <article
                  key={event.id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="h-1.5 bg-primary/80 transition-colors group-hover:bg-accent" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl ${color}`}
                      >
                        {formattedDate && typeof formattedDate !== "string" ? (
                          <>
                            <span className="text-2xl font-extrabold leading-none">
                              {formattedDate.day}
                            </span>
                            <span className="mt-1 text-xs font-bold uppercase">
                              {formattedDate.month}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl">ðŸ“…</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Club activity
                        </span>
                        <h2 className="mt-2 break-words text-lg font-extrabold leading-snug text-text transition group-hover:text-primary sm:text-xl">
                          {event.title}
                        </h2>
                        {formattedDate && typeof formattedDate !== "string" && (
                          <p className="mt-2 text-xs font-medium text-text-muted">
                            {formattedDate.year}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-text-muted">
                      {event.description || "More details about this event will be available soon."}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
                      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                        <span aria-hidden="true">ðŸ—“ï¸</span>
                        {formattedDate && typeof formattedDate !== "string"
                          ? formattedDate.full
                          : rawDate || "Date to be announced"}
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                        Club event
                        <span aria-hidden="true">âœ¦</span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 border-t border-border-subtle py-6 text-center">
          <p className="text-sm text-text-muted">
            Made for your campus community
            <span className="mx-2 text-primary">âœ¦</span>
            EduNex
          </p>
        </footer>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(hod)\hod\layout.tsx
```

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  {
    label: "Overview",
    href: "/hod/dashboard",
    icon: "âŒ‚",
  },
  {
    label: "Student Management",
    href: "/hod/students",
    icon: "â™§",
  },
  {
    label: "Coordinator Management",
    href: "/hod/coordinators",
    icon: "â™™",
  },
  {
    label: "Club Management",
    href: "/hod/clubs",
    icon: "â–¦",
  },
  {
    label: "Event Approvals",
    href: "/hod/approvals",
    icon: "âœ“",
  },
];

export default function HodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text md:flex">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">
            EduNex
          </h1>

          <p className="mt-1 text-sm text-text-muted">
            HOD Administration
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            HOD Workspace
          </p>

          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>

                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition hover:bg-background disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg border border-border px-3 py-2 md:hidden"
          >
            â˜°
          </button>

          <div>
            <p className="font-semibold">HOD Portal</p>

            <p className="text-xs text-text-muted">
              Department management and administration
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```


# FILE: apps\web\app\(hod)\hod\approvals\page.tsx
```
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import PageHeader from "@/components/ui/page-header";
import EventApprovalCard from "@/features/hod/components/event-approval-card";
import type { PendingEvent } from "@/features/hod/api/hod-event-approvals";
import {
  useHodPendingEvents,
  useReviewHodEvent,
} from "@/features/hod/api/hod-event-approvals-query";

export default function EventApprovalsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const {
    data: events = [],
    isLoading,
    isFetching,
    isError,
    error: fetchError,
    refetch,
  } = useHodPendingEvents();

  const reviewMutation = useReviewHodEvent();

  const [message, setMessage] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(
    null,
  );

  // Redirect users who are not logged in.
  if (!isPending && !session) {
    router.replace("/hod/login");
  }

  const handleRefresh = async () => {
    await refetch();
  };

  const handleReview = async (
    eventId: number,
    decision: "approved" | "rejected",
    comments?: string,
  ) => {
    setProcessingId(eventId);
    setReviewError("");
    setMessage("");

    try {
      const response = await reviewMutation.mutateAsync({
        eventId,
        decision,
        comments,
      });

      setMessage(
        response?.message ??
          `Event ${
            decision === "approved" ? "approved" : "rejected"
          } successfully.`,
      );
    } catch (error) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setReviewError(
        errorMessage ??
          `Unable to ${
            decision === "approved" ? "approve" : "reject"
          } this event. Please try again.`,
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-text-muted">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-text-muted">
          Redirecting to HOD login...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm text-text-muted">
              EduNex / HOD / Event Approvals
            </p>

            <PageHeader
              title="Event Approvals"
              description="Review events submitted by campus clubs and approve or reject them."
            />
          </div>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <span>â†»</span>
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {message && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </div>
        )}

        {(reviewError || isError) && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>
              {reviewError ||
                (fetchError instanceof Error
                  ? fetchError.message
                  : "Unable to load pending events. Please try again.")}
            </p>

            {isError && (
              <button
                type="button"
                onClick={() => void handleRefresh()}
                className="font-semibold underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        <section>
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-surface p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-2xl">
              ðŸ“‹
            </div>

            <div>
              <p className="text-sm text-text-muted">
                Events awaiting your decision
              </p>

              <p className="mt-1 text-2xl font-bold">
                {isLoading ? "â€”" : events.length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
              <p className="text-text-muted">
                Loading pending events...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface px-6 py-12 text-center">
              <div className="text-4xl">ðŸŽ‰</div>

              <h2 className="mt-4 text-xl font-bold">
                No pending events
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                There are no events waiting for your review right now.
              </p>

              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={isFetching}
                className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {isFetching ? "Refreshing..." : "Check again"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {events.map((event: PendingEvent) => (
                <EventApprovalCard
                  key={event.id}
                  event={event}
                  processing={processingId === event.id}
                  onReview={handleReview}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="border-t border-border pt-5 text-center text-sm text-text-muted">
          Â© {new Date().getFullYear()} EduNex Â· HOD Event Management
        </footer>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(hod)\hod\clubs\page.tsx
```
import ClubManagementView from "@/features/clubs/components/club-management-view";

export default function HODClubsPage() {
  return <ClubManagementView />;
}
```


# FILE: apps\web\app\(hod)\hod\coordinators\page.tsx
```

"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  retryUnlessAuthError,
  useCoordinatorAssignments,
  useCreateCoordinator,
  useHodStudents,
} from "@/features/coordinator/api/coordinator-query";
import { useClubsQuery } from "@/features/clubs/api/club-query";

import { authClient } from "@/lib/auth-client";


type CoordinatorFormInput = {
  studentId: number;
  clubId: number;
};

export default function CoordinatorPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const { data: session } = authClient.useSession();


  const {
    data: coordinatorAssignments = [],
    isPending,
    isError,
    error,
    refetch,
  } = useCoordinatorAssignments();

  const createCoordinatorMutation = useCreateCoordinator();

  const {
  data: students = [],
  isPending: studentsLoading,
  isError: studentsError,
} = useHodStudents();

const {
  data: clubs = [],
  isPending: clubsLoading,
  isError: clubsError,
} = useClubsQuery(retryUnlessAuthError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoordinatorFormInput>();

  const onSubmit: SubmitHandler<CoordinatorFormInput> = async (values) => {
    setSuccessMessage("");

    try {
      await createCoordinatorMutation.mutateAsync({
        studentId: Number(values.studentId),
        clubId: Number(values.clubId),
      });

      setSuccessMessage("Coordinator appointed successfully.");
      reset();
      await refetch();
    } catch {
      // The mutation error is displayed below.
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">
            Coordinator Management
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Appoint students as club coordinators and manage assignments.
          </p>
        </header>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold">
            Appoint a Coordinator
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
<div>
  <label
    htmlFor="studentId"
    className="mb-2 block text-sm font-medium"
  >
    Student
  </label>

  <select 
    id="studentId"
    {...register("studentId", {
      required: "Please select a student",
      valueAsNumber: true,
      min: { value: 1, message: "Please select a student" },
    })}
    className="w-full p-3 pr-6 border rounded-lg border-border bg-background py-3 "
    defaultValue=""
    disabled={studentsLoading || studentsError}
  >
    <option value="" disabled>
      {studentsLoading
        ? "Loading students..."
        : studentsError
          ? "Failed to load students"
          : "Select a student"}
    </option>

    {students.map((student) => (
      <option key={student.id} value={student.id}>
        {student.name}
      </option>
    ))}
  </select>

  {errors.studentId && (
    <p className="mt-1 text-sm text-red-500">
      {errors.studentId.message}
    </p>
  )}
</div>

<div>
  <label
    htmlFor="clubId"
    className="mb-2 block text-sm font-medium"
  >
    Club
  </label>

  <select
    id="clubId"
    {...register("clubId", {
      required: "Please select a club",
      valueAsNumber: true,
      min: { value: 1, message: "Please select a club" },
    })}
    className="w-full rounded-lg border border-border bg-background px-4 py-3 "
    defaultValue=""
    disabled={clubsLoading || clubsError}
  >
    <option value="" disabled>
      {clubsLoading
        ? "Loading clubs..."
        : clubsError
          ? "Failed to load clubs"
          : "Select a club"}
    </option>

    {clubs.map((club) => (
      <option key={club.id} value={club.id}>
        {club.name}
      </option>
    ))}
  </select>

  {errors.clubId && (
    <p className="mt-1 text-sm text-red-500">
      {errors.clubId.message}
    </p>
  )}
</div>

            {createCoordinatorMutation.isError && (
              <p className="text-sm text-red-500 md:col-span-2">
                {createCoordinatorMutation.error instanceof Error
                  ? createCoordinatorMutation.error.message
                  : "Failed to appoint coordinator. Please try again."}
              </p>
            )}

            {successMessage && (
              <p className="text-sm text-green-600 md:col-span-2">
                {successMessage}
              </p>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={createCoordinatorMutation.isPending}
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createCoordinatorMutation.isPending
                  ? "Appointing..."
                  : "Appoint Coordinator"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Coordinator Assignments
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                View the students appointed to clubs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
            >
              Refresh
            </button>
          </div>

          {isPending ? (
            <p className="py-8 text-center text-text-muted">
              Loading coordinator assignments...
            </p>
          ) : isError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-500">
                {error instanceof Error
                  ? error.message
                  : "Failed to load coordinator assignments."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-white"
              >
                Try Again
              </button>
            </div>
          ) : coordinatorAssignments.length === 0 ? (
            <p className="py-8 text-center text-text-muted">
              No coordinators have been appointed yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Admission Number</th>
                    <th className="px-4 py-3">Club</th>
                    <th className="px-4 py-3">Appointed By</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {coordinatorAssignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-4 font-medium">
                        {assignment.studentName}
                      </td>

                      <td className="px-4 py-4">
                        {assignment.admissionNumber}
                      </td>

                      <td className="px-4 py-4">
                        {assignment.clubName}
                      </td>

                      <td className="px-4 py-4">
  Appointed by {session?.user?.name || assignment.appointedBy}
</td>

                      <td className="px-4 py-4">
                        {assignment.createdAt
                          ? new Date(
                              assignment.createdAt
                            ).toLocaleDateString()
                          : "â€”"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(hod)\hod\dashboard\page.tsx
```

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  UserCheck,
  CalendarCheck,
  Building2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import { useHodDashboard } from "@/features/hod/api/hod-query";

export default function HodDashboardPage() {
  const router = useRouter();

  const {
    data: session,
    isPending: checkingSession,
  } = authClient.useSession();

  const {
    data: dashboard,
    isPending,
    isError,
    error,
    refetch,
  } = useHodDashboard();

  useEffect(() => {
    if (!checkingSession && !session?.user) {
      router.replace("/login");
    }
  }, [checkingSession, session, router]);

  if (checkingSession) {
    return (
      <p className="py-10 text-text-muted">
        Checking session...
      </p>
    );
  }

  if (!session?.user) {
    return (
      <p className="py-10 text-text-muted">
        Redirecting to login...
      </p>
    );
  }

  if (isPending) {
    return (
      <p className="py-10 text-text-muted">
        Loading overview...
      </p>
    );
  }

  if (isError || !dashboard) {
    return (
      <Card padding="lg">
        <h2 className="text-xl font-bold">
          Unable to load overview
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error
            ? error.message
            : "Please try again."}
        </p>

        <Button
          variant="primary"
          className="mt-4"
          onClick={() => void refetch()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  const statistics = [
    {
      title: "Total Students",
      value: dashboard.totalStudents,
      icon: Users,
    },
    {
      title: "Total Staff",
      value: dashboard.totalStaff,
      icon: GraduationCap,
    },
    {
      title: "Total Coordinators",
      value: dashboard.totalCoordinators,
      icon: UserCheck,
    },
    {
      title: "Pending Approvals",
      value: dashboard.pendingApprovals,
      icon: CalendarCheck,
    },
  ];

  const sections = [
    {
      title: "Student Management",
      description:
        "Browse students and filter by department and semester.",
      href: "/hod/students",
      icon: Users,
    },
    {
      title: "Coordinator Management",
      description:
        "Appoint student coordinators and view their assignments.",
      href: "/hod/coordinators",
      icon: UserCheck,
    },
    {
      title: "Club Management",
      description:
        "Create clubs and view existing college clubs.",
      href: "/hod/clubs",
      icon: Building2,
    },
    {
      title: "Event Approvals",
      description:
        "Review and manage event approval requests.",
      href: "/hod/approvals",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="HOD Workspace"
        title={`Welcome, ${session.user.name || "HOD"}`}
        description="Manage your department's students, clubs, coordinators, and event approvals."
      />

      <Card padding="lg">
        <h2 className="text-lg font-semibold">
          Department Overview
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Heres a summary of your departments activities.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-secondary p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-text-muted">
                    {item.title}
                  </p>

                  <Icon
                    size={20}
                    className="shrink-0 text-primary"
                  />
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {item.value ?? "â€”"}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <section>
        <h2 className="mb-4 text-xl font-bold">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Card
                key={section.href}
                padding="lg"
                className="transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon size={22} />
                </div>

                <h3 className="font-semibold">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  {section.description}
                </p>

                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => router.push(section.href)}
                >
                  Open page â†’
                </Button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
```


# FILE: apps\web\app\(hod)\hod\students\page.tsx
```
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { useDepartment } from "@/features/departments/api/department-query";
import type { HodStudent } from "@/features/hod/api/hod";
import { useHodStudents } from "@/features/hod/api/hod-query";

export default function HODStudentsPage() {
  const router = useRouter();

  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();

  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<HodStudent | null>(null);

  const departmentId =
    selectedDepartment === ""
      ? undefined
      : Number(selectedDepartment);

  const semesterNumber =
    semester === ""
      ? undefined
      : Number(semester);

  const {
    data: departments = [],
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
    refetch: refetchDepartments,
  } = useDepartment(!!session && !isSessionPending);

  const {
    data: students = [],
    isPending: isStudentsPending,
    isError: isStudentsError,
    error: studentsError,
    refetch: refetchStudents,
  } = useHodStudents(
    departmentId,
    semesterNumber,
    !!session && !isSessionPending,
  );

  const filteredStudents = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return students;
    }

    return students.filter((student) =>
      [
        student.name,
        student.email,
        student.admissionNumber,
        student.departmentName,
      ].some((value) =>
        value?.toLowerCase().includes(searchText),
      ),
    );
  }, [students, search]);

  if (isSessionPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-muted">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-text-muted">
            Please sign in to view the HOD student directory.
          </p>

          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Go to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold">EduNex</h1>
            <p className="text-sm text-text-muted">
              Head of Department Portal
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/hod/dashboard")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-background"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-text-muted">
            HOD WORKSPACE
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Student Directory
          </h2>

          <p className="mt-2 text-sm text-text-muted">
            Search students and filter them by department and semester.
          </p>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">
              Students Retrieved
            </p>
            <p className="mt-2 text-3xl font-bold">
              {students.length}
            </p>
          </article>

          <article className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-text-muted">
              Matching Students
            </p>
            <p className="mt-2 text-3xl font-bold">
              {filteredStudents.length}
            </p>
          </article>
        </section>

        <section className="mb-6 rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-4 font-semibold">
            Search and Filters
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="student-search"
                className="mb-2 block text-sm font-medium"
              >
                Search Students
              </label>

              <input
                id="student-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, email or admission number"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-medium"
              >
                Department
              </label>

              <select
                id="department"
                value={selectedDepartment}
                onChange={(event) => {
                  setSelectedDepartment(event.target.value);
                  setSelectedStudent(null);
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">All Departments</option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name} ({department.code})
                  </option>
                ))}
              </select>

              {isDepartmentsPending && (
                <p className="mt-2 text-sm text-text-muted">
                  Loading departments...
                </p>
              )}

              {isDepartmentsError && (
                <div className="mt-2 text-sm text-red-500">
                  <p>Unable to load departments.</p>
                  <button
                    type="button"
                    onClick={() => void refetchDepartments()}
                    className="mt-1 underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="semester"
                className="mb-2 block text-sm font-medium"
              >
                Semester
              </label>

              <select
                id="semester"
                value={semester}
                onChange={(event) => {
                  setSemester(event.target.value);
                  setSelectedStudent(null);
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">All Semesters</option>

                {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                  <option key={number} value={number}>
                    Semester {number}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedDepartment("");
              setSemester("");
              setSelectedStudent(null);
            }}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-background"
          >
            Clear Filters
          </button>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <h3 className="font-semibold">Students</h3>
            <p className="text-sm text-text-muted">
              {filteredStudents.length} student(s) found
            </p>
          </div>

          {isStudentsPending ? (
            <div className="p-8 text-center text-text-muted">
              Loading students...
            </div>
          ) : isStudentsError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-500">
                {studentsError instanceof Error
                  ? studentsError.message
                  : "Unable to load students."}
              </p>

              <button
                type="button"
                onClick={() => void refetchStudents()}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-background">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">
                      Admission Number
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Department
                    </th>
                    <th className="px-4 py-3 font-semibold">Semester</th>
                    <th className="px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-text-muted"
                      >
                        No students match your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`border-b border-border last:border-0 ${
                          selectedStudent?.id === student.id
                            ? "bg-background"
                            : "hover:bg-background"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{student.name}</p>
                          <p className="mt-1 text-xs text-text-muted">
                            {student.email}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          {student.admissionNumber}
                        </td>

                        <td className="px-4 py-3">
                          {student.departmentName}
                        </td>

                        <td className="px-4 py-3">
                          {student.semester}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="font-medium text-primary underline underline-offset-4"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedStudent && (
          <section className="mt-6 rounded-xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-muted">
                  STUDENT DETAILS
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  {selectedStudent.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-background"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-text-muted">
                  Admission Number
                </p>
                <p className="mt-1 font-medium">
                  {selectedStudent.admissionNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Email</p>
                <p className="mt-1 break-all font-medium">
                  {selectedStudent.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <p className="mt-1 font-medium">
                  {selectedStudent.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">
                  Department
                </p>
                <p className="mt-1 font-medium">
                  {selectedStudent.departmentName}
                  {selectedStudent.departmentCode
                    ? ` (${selectedStudent.departmentCode})`
                    : ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Semester</p>
                <p className="mt-1 font-medium">
                  {selectedStudent.semester}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">Student ID</p>
                <p className="mt-1 font-medium">
                  {selectedStudent.id}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(principal)\principal\layout.tsx
```
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const menuItems = [
  {
    label: "Overview",
    href: "/principal",
    icon: "âŒ‚",
  },
  {
    label: "Staff Management",
    href: "/principal/staff",
    icon: "â™™",
  },
  {
    label: "Student Management",
    href: "/principal/students",
    icon: "â™§",
  },
  {
    label: "Departments",
    href: "/principal/departments",
    icon: "â–¦",
  },
  {
    label: "College Events",
    href: "/principal/events",
    icon: "â–£",
  },
  {
    label: "Approvals",
    href: "/principal/approvals",
    icon: "âœ“",
  },
];

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text md:flex">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border p-6">
          <h1 className="text-2xl font-bold text-primary">
            EduNex
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Principal Administration
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Administration
          </p>

          {menuItems.map((item) => {
            const active =
              item.href === "/principal"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded-xl border border-border px-4 py-3 text-left text-sm font-medium transition hover:bg-background disabled:opacity-50"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg border border-border px-3 py-2 md:hidden"
          >
            â˜°
          </button>

          <div>
            <p className="font-semibold">Principal Portal</p>
            <p className="text-xs text-text-muted">
              College administration and management
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
```


# FILE: apps\web\app\(principal)\principal\page.tsx
```
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { getPrincipalDashboard } from "@/features/principal/api/principal";

type DashboardResponse = {
  success: boolean;
  message: string;
  data: {
    staffId: string;
    employeeId: string;
    role: "principal";
    designation: string | null;
  };
};

export default function PrincipalDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: checkingSession } =
    authClient.useSession();

  useEffect(() => {
    if (!checkingSession && !session) {
      router.replace("/login");
    }
  }, [checkingSession, session, router]);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<DashboardResponse>({
    queryKey: ["principal", "dashboard"],
    queryFn: getPrincipalDashboard,
    enabled: !!session && !checkingSession,
    retry: false,
  });

  if (checkingSession || (!session && !isError)) {
    return <p className="py-10 text-text-muted">Checking session...</p>;
  }

  if (!session) {
    return <p className="py-10 text-text-muted">Redirecting to login...</p>;
  }

  if (isPending) {
    return <p className="py-10 text-text-muted">Loading overview...</p>;
  }

  if (isError || !data?.data) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold">Unable to load overview</h2>
        <p className="mt-2 text-sm text-text-muted">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Retry
        </button>
      </section>
    );
  }

  const principal = data.data;

  const sections = [
    {
      title: "Staff Management",
      description: "Add HODs, manage staff accounts and assignments.",
      href: "/principal/staff",
    },
    {
      title: "Student Management",
      description: "Browse students by department and semester.",
      href: "/principal/students",
    },
    {
      title: "Departments",
      description: "View college departments and their details.",
      href: "/principal/departments",
    },
    {
      title: "College Events",
      description: "View college-wide event information.",
      href: "/principal/events",
    },
    {
      title: "Approvals",
      description: "Review requests that require Principal approval.",
      href: "/principal/approvals",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Principal Workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome, {session.user.name || "Principal"}
        </h1>

        <p className="mt-2 text-text-muted">
          {principal.designation || "Principal"} Â· Employee ID:{" "}
          {principal.employeeId}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold">Administration overview</h2>
        <p className="mt-2 text-sm text-text-muted">
          Manage college staff, students, departments and events from
          one place.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Quick access</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {section.description}
              </p>
              <p className="mt-4 text-sm font-semibold text-primary">
                Open page â†’
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
```


# FILE: apps\web\app\(principal)\principal\approvals\page.tsx
```
export default function PrincipalApprovalsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Approvals</h1>
      <p className="text-sm text-text-muted">
        Review requests that require Principal authorization.
      </p>
      <div className="rounded-xl border border-border bg-surface p-5 text-sm">
        nothing here 
      </div>
    </section>
  );
}
```


# FILE: apps\web\app\(principal)\principal\departments\page.tsx
```
"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrincipalDepartments } from "@/features/principal/api/principal";

type Department = {
  id: number;
  name: string;
  code: string;
};

type DepartmentResponse = {
  success: boolean;
  data: Department[];
  message?: string;
};

export default function DepartmentsPage() {
  const { data, isPending, isError, error, refetch } =
    useQuery<DepartmentResponse>({
      queryKey: ["principal", "departments"],
      queryFn: getPrincipalDepartments,
      retry: false,
    });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="mt-2 text-sm text-text-muted">
          View the departments registered in EduNex.
        </p>
      </header>

      {isPending ? (
        <p className="text-text-muted">Loading departments...</p>
      ) : isError ? (
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Unable to load departments."}
          </p>
          <button
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="p-4">Department</th>
                <th className="p-4">Code</th>
                <th className="p-4">ID</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((department) => (
                <tr key={department.id} className="border-b border-border last:border-0">
                  <td className="p-4 font-medium">{department.name}</td>
                  <td className="p-4">{department.code}</td>
                  <td className="p-4">{department.id}</td>
                </tr>
              ))}
              {data?.data?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-text-muted">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
```


# FILE: apps\web\app\(principal)\principal\events\page.tsx
```
export default function PrincipalEventsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">College Events</h1>
      <p className="text-sm text-text-muted">
        View college-wide events and their statuses.
      </p>
      <div className="rounded-xl border border-border bg-surface p-5 text-sm">
        no events yet
      </div>
    </section>
  );
}
```


# FILE: apps\web\app\(principal)\principal\roles\page.tsx
```

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRoles,
  getRole,
  getPermissionCatalog,
  createRole,
  updateRole,
  type ApiResponse,
  type Role,
  type RoleDetail,
  type PermissionGroup,
} from "@/features/principal/api/roles";

export default function RolesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissionIds, setPermissionIds] = useState<number[]>([]);

  const isEditing = editingRoleId !== null;

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<Role[]>>({
    queryKey: ["principal", "roles"],
    queryFn: getRoles,
    retry: false,
  });

  const {
    data: permissionData,
    isPending: permissionsLoading,
    isError: permissionsError,
  } = useQuery<ApiResponse<PermissionGroup[]>>({
    queryKey: ["principal", "role-permissions"],
    queryFn: getPermissionCatalog,
    enabled: isModalOpen,
    retry: false,
  });

  const {
    data: roleDetailData,
    isPending: roleLoading,
    isError: roleLoadingError,
  } = useQuery<ApiResponse<RoleDetail>>({
    queryKey: ["principal", "role", editingRoleId],
    queryFn: () => getRole(editingRoleId!),
    enabled: isModalOpen && isEditing,
    retry: false,
  });

  const roleDetail = roleDetailData?.data;

  useEffect(() => {
    if (roleDetail && editingRoleId !== null) {
      setName(roleDetail.name);
      setDescription(roleDetail.description ?? "");
      setPermissionIds(roleDetail.permissionIds);
    }
  }, [roleDetail, editingRoleId]);

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["principal", "roles"],
      });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: {
      id: number;
      data: {
        name?: string;
        description?: string;
        permissionIds?: number[];
      };
    }) => updateRole(input.id, input.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["principal", "roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["principal", "role", editingRoleId],
      });
      closeModal();
    },
  });

  const roles = data?.data ?? [];
  const permissionGroups = permissionData?.data ?? [];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function closeModal() {
    setIsModalOpen(false);
    setEditingRoleId(null);
    setName("");
    setDescription("");
    setPermissionIds([]);
    createMutation.reset();
    updateMutation.reset();
  }

  function openCreateModal() {
    closeModal();
    setIsModalOpen(true);
  }

  function openEditModal(roleId: number) {
    setName("");
    setDescription("");
    setPermissionIds([]);
    createMutation.reset();
    updateMutation.reset();
    setEditingRoleId(roleId);
    setIsModalOpen(true);
  }

  function togglePermission(id: number) {
    setPermissionIds((current) =>
      current.includes(id)
        ? current.filter((permissionId) => permissionId !== id)
        : [...current, id],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isEditing && editingRoleId !== null) {
      updateMutation.mutate({
        id: editingRoleId,
        data: {
          name: name.trim(),
          description: description.trim(),
          permissionIds,
        },
      });
    } else {
      createMutation.mutate({
        name: name.trim(),
        description: description.trim() || undefined,
        permissionIds,
      });
    }
  }

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
          <p className="mt-2 text-sm text-text-muted">
            Manage roles and control what users can access in EduNex.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          + Create Role
        </button>
      </header>

      {isPending ? (
        <p className="text-text-muted">Loading roles...</p>
      ) : isError ? (
        <section className="rounded-xl border border-border bg-surface p-6">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Unable to load roles."}
          </p>
          <button
            onClick={() => void refetch()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            Try again
          </button>
        </section>
      ) : (
        <section className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="p-4">Role</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4">Assigned Users</th>
                <th className="p-4">Type</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="p-4 font-medium">{role.name}</td>
                  <td className="p-4 text-text-muted">{role.slug}</td>
                  <td className="p-4">
                    {role.description || "No description"}
                  </td>
                  <td className="p-4">{role.totalAssigned}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-background px-3 py-1 text-xs">
                      {role.isSystem ? "System" : "Custom"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openEditModal(role.id)}
                      disabled={role.slug === "super-admin"}
                      className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {roles.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-text-muted"
                  >
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Edit Role" : "Create New Role"}
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  {isEditing
                    ? "Update role details and permissions."
                    : "Define a role and assign its permissions."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-text-muted hover:bg-background"
              >
                âœ•
              </button>
            </div>

            {isEditing && roleLoading ? (
              <p className="p-6 text-sm text-text-muted">
                Loading role details...
              </p>
            ) : isEditing && roleLoadingError ? (
              <p className="p-6 text-sm text-red-600">
                Unable to load role details. Close the modal and try again.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col"
              >
                <div className="space-y-5 overflow-y-auto p-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Role Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Event Manager"
                      required
                      minLength={2}
                      maxLength={100}
                      disabled={isEditing && !!roleDetail?.isSystem}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                    />
                    {isEditing && roleDetail?.isSystem && (
                      <p className="mt-1 text-xs text-text-muted">
                        System role names cannot be changed.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the responsibilities of this role"
                      maxLength={500}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Permissions</h3>
                      <span className="text-xs text-text-muted">
                        {permissionIds.length} selected
                      </span>
                    </div>

                    {permissionsLoading ? (
                      <p className="text-sm text-text-muted">
                        Loading permissions...
                      </p>
                    ) : permissionsError ? (
                      <p className="text-sm text-red-600">
                        Unable to load permissions.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {permissionGroups.map((group) => (
                          <div
                            key={group.resource}
                            className="rounded-xl border border-border p-4"
                          >
                            <h4 className="mb-3 text-sm font-semibold capitalize">
                              {group.resource}
                            </h4>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {group.permissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex cursor-pointer items-start gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={permissionIds.includes(
                                      permission.id,
                                    )}
                                    onChange={() =>
                                      togglePermission(permission.id)
                                    }
                                    className="mt-1 accent-primary"
                                  />

                                  <span>
                                    <span className="font-medium capitalize">
                                      {permission.action}
                                    </span>
                                    {permission.description && (
                                      <span className="mt-0.5 block text-xs text-text-muted">
                                        {permission.description}
                                      </span>
                                    )}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {mutationError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {mutationError instanceof Error
                        ? mutationError.message
                        : "Unable to save role."}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 border-t border-border p-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-border px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSaving ||
                      name.trim().length < 2 ||
                      permissionsLoading ||
                      permissionsError
                    }
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : isEditing
                        ? "Save Changes"
                        : "Create Role"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```


# FILE: apps\web\app\(principal)\principal\staff\page.tsx
```
"use client";

import { useState } from "react";
import AddHodForm from "@/features/principal/components/add-hod-form";

type StaffTab = "all" | "faculty" | "hod" | "add";

export default function StaffManagementPage() {
  const [activeTab, setActiveTab] = useState<StaffTab>("add");

  const tabs: { label: string; value: StaffTab }[] = [
    { label: "All Staff", value: "all" },
    { label: "Faculty", value: "faculty" },
    { label: "HODs", value: "hod" },
    { label: "Add Staff", value: "add" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <p className="mt-2 text-sm text-text-muted">
          Manage college staff, faculty members and Heads of Department.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-surface text-text-muted hover:bg-background"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "add" && <AddHodForm />}

      {activeTab === "all" && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">All Staff</h2>
          <p className="mt-2 text-sm text-text-muted">
            The staff listing will appear here when the staff-list API
            is connected.
          </p>
        </section>
      )}

      {activeTab === "faculty" && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Faculty</h2>
          <p className="mt-2 text-sm text-text-muted">
            Faculty accounts will appear here when the staff-list API
            is connected.
          </p>
        </section>
      )}

      {activeTab === "hod" && (
        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-lg font-semibold">Heads of Department</h2>
          <p className="mt-2 text-sm text-text-muted">
            HOD accounts and their department assignments will appear
            here when the staff-list API is connected.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Add HOD
          </button>
        </section>
      )}
    </div>
  );
}
```


# FILE: apps\web\app\(principal)\principal\students\page.tsx
```
export default function PrincipalStudentsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">Student Management</h1>
      <p className="text-sm text-text-muted">
        The Principal student page should reuse the existing student
        listing with department and semester filters.
      </p>
      <p className="rounded-xl border border-border bg-surface p-5 text-sm">
        Next, connect the existing student listing and API here rather
        than creating a duplicate student-management system.
      </p>
    </section>
  );
}
```


# FILE: apps\web\app\(student)\studentDashboard\page.tsx
```


"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/button";
import { useCoordinatorStatusQuery } from "@/features/coordinator/api/coordinator-query";

type DashboardMode = "student" | "coordinator";

const studentStats = [
  { title: "Study Materials", value: "24", description: "Resources to explore", icon: "ðŸ“š", href: "/student/resources", color: "bg-blue-50 text-blue-700" },
  { title: "Upcoming Events", value: "03", description: "Events to look forward to", icon: "ðŸŽ‰", href: "/student/events", color: "bg-orange-50 text-orange-600" },
  { title: "My Clubs", value: "02", description: "Your campus communities", icon: "ðŸ¤", href: "/student/clubs", color: "bg-green-50 text-green-700" },
  { title: "My Reports", value: "01", description: "Track your reported issues", icon: "ðŸ“", href: "/student/issues", color: "bg-purple-50 text-purple-700" },
];

const studentEvents = [
  { id: 1, name: "Tech Fest 2026", category: "Technology", date: "Oct 30", time: "10:00 AM", venue: "Main Auditorium", description: "Explore innovation, technology exhibitions, coding challenges and exciting workshops.", icon: "ðŸ’»" },
  { id: 2, name: "Arts & Culture Day", category: "Cultural", date: "Nov 02", time: "11:00 AM", venue: "College Ground", description: "Celebrate campus creativity with performances, music and cultural activities.", icon: "ðŸŽ­" },
  { id: 3, name: "Career Connect", category: "Career", date: "Nov 05", time: "09:30 AM", venue: "Seminar Hall", description: "Meet professionals, discover career opportunities and improve your interview skills.", icon: "ðŸš€" },
];

const announcements = [
  { id: 1, title: "Library Resource Update", message: "New learning materials have been added to the student resource library.", date: "Today", type: "Academic", icon: "ðŸ“š", color: "bg-blue-50 text-blue-700" },
  { id: 2, title: "Club Memberships", message: "Check your membership requests to see the latest approval status.", date: "Yesterday", type: "Clubs", icon: "ðŸ¤", color: "bg-green-50 text-green-700" },
  { id: 3, title: "Upcoming Campus Events", message: "Registration is open for upcoming student activities and events.", date: "Oct 26", type: "Events", icon: "ðŸŽ‰", color: "bg-orange-50 text-orange-700" },
];

const clubs = [
  { id: 1, name: "Tech Innovators", category: "Technology & Innovation", members: "45+ members", icon: "ðŸ’»", color: "from-blue-600 to-indigo-600" },
  { id: 2, name: "Creative Minds", category: "Arts & Culture", members: "32+ members", icon: "ðŸŽ¨", color: "from-orange-500 to-pink-500" },
  { id: 3, name: "Green Campus", category: "Environment & Community", members: "28+ members", icon: "ðŸŒ±", color: "from-green-500 to-emerald-600" },
];

const studentQuickActions = [
  { title: "Explore Clubs", description: "Find your community", icon: "ðŸ¤", href: "/student/clubs", color: "bg-green-50" },
  { title: "Browse Events", description: "Discover campus activities", icon: "ðŸŽ‰", href: "/student/events", color: "bg-orange-50" },
  { title: "Study Resources", description: "Learn something new", icon: "ðŸ“–", href: "/student/resources", color: "bg-blue-50" },
  { title: "Report an Issue", description: "Let us know what happened", icon: "ðŸ’¬", href: "/student/issues", color: "bg-purple-50" },
];

const coordinatorStats = [
  { title: "Total Events", value: "24", icon: "ðŸ“…", color: "bg-primary-subtle text-primary", href: "/club-coordinator/events" },
  { title: "Upcoming Events", value: "08", icon: "ðŸŽ¯", color: "bg-secondary text-secondary-foreground", href: "/club-coordinator/events" },
  { title: "Pending Requests", value: "03", icon: "â³", color: "bg-accent-subtle text-accent", href: "/club-coordinator/request-event" },
  { title: "Events Completed", value: "16", icon: "âœ…", color: "bg-secondary text-text-muted", href: "/club-coordinator/events" },
];

const coordinatorEvents = [
  { title: "TechFest 2026", date: "15", month: "NOV", category: "Technical", status: "Approved", color: "bg-primary-subtle text-primary" },
  { title: "Cultural Fusion", date: "20", month: "NOV", category: "Cultural", status: "Pending", color: "bg-accent-subtle text-accent" },
  { title: "Campus Football Cup", date: "25", month: "NOV", category: "Sports", status: "Approved", color: "bg-secondary text-secondary-foreground" },
];

const activities = [
  { title: "Event proposal submitted", description: "Your event proposal was submitted for approval.", date: "2 hours ago", icon: "ðŸ“" },
  { title: "Student membership updated", description: "A membership request was updated.", date: "Yesterday", icon: "ðŸ‘¥" },
  { title: "Event details updated", description: "You updated your event information.", date: "2 days ago", icon: "ðŸ“…" },
];

const coordinatorQuickActions = [
  { title: "View Events", description: "Manage your club events", icon: "ðŸ“…", href: "/club-coordinator/events" },
  { title: "Request an Event", description: "Submit a new event proposal", icon: "ðŸ“", href: "/club-coordinator/request-event" },
];

const studentMenu = [
  { label: "Overview", href: "/student/dashboard", icon: "âŒ‚" },
  { label: "My Profile", href: "/student/profile", icon: "ðŸ‘¤" },
  { label: "Clubs", href: "/student/clubs", icon: "ðŸ¤" },
  { label: "Events", href: "/student/events", icon: "ðŸ“…" },
  { label: "Study Resources", href: "/student/resources", icon: "ðŸ“š" },
  { label: "Study Groups", href: "/student/study-groups", icon: "ðŸ‘¥" },
  { label: "Lost & Found", href: "/student/lost-found", icon: "ðŸ”Ž" },
  { label: "Report an Issue", href: "/student/issues", icon: "ðŸ“" },
];

const coordinatorMenu = [
  { label: "Dashboard", href: "/club-coordinator/dashboard", icon: "â–¦" },
  { label: "My Events", href: "/club-coordinator/events", icon: "ðŸ“…" },
  { label: "Request Event", href: "/club-coordinator/request-event", icon: "ðŸ“" },
];

export default function StudentDashboard() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: coordinatorStatus, isPending: coordinatorStatusPending } = useCoordinatorStatusQuery();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>("student");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const displayName = user?.name?.trim() || "";
  const firstName = displayName.split(/\s+/)[0] || "Student";
  const coordinatorName = displayName || "Coordinator";
  const coordinatorInitial = coordinatorName.charAt(0).toUpperCase();
  const isCoordinator = coordinatorStatus?.isCoordinator === true;
  const menuItems = dashboardMode === "student" ? studentMenu : coordinatorMenu;

  const filteredEvents = studentEvents.filter((event) =>
    `${event.name} ${event.category} ${event.venue}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

  if (isPending || coordinatorStatusPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm font-medium text-muted">Preparing your campus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {mobileMenuOpen && (
        <button type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[82px] items-center justify-between border-b border-border px-6">
          <Link href={dashboardMode === "student" ? "/student/dashboard" : "/student/dashboard"} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-md">E</div>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-primary">EduNex</p>
              <p className="text-xs text-muted">Your campus, connected.</p>
            </div>
          </Link>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-muted hover:bg-secondary lg:hidden">âœ•</button>
        </div>

        <div className="px-5 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
            {dashboardMode === "student" ? "Student workspace" : "Coordinator workspace"}
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = dashboardMode === "coordinator"
                ? item.href === "/club-coordinator/dashboard" && pathname === "/student/dashboard"
                : pathname === item.href;
              return (
                <Link key={item.href} href={item.href === "/club-coordinator/dashboard" ? "/student/dashboard" : item.href} onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${active ? "bg-primary text-white shadow-md shadow-primary/15" : "text-muted hover:bg-secondary hover:text-primary"}`}>
                  <span className="flex h-7 w-7 items-center justify-center text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-5">
          {dashboardMode === "student" ? (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#416fc2] p-5 text-white">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">âœ¨</div>
              <h3 className="font-bold">Make campus life count!</h3>
              <p className="mt-2 text-xs leading-5 text-white/80">Join a club, attend an event, and discover new opportunities.</p>
              <Link href="/student/clubs" className="mt-4 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-primary transition hover:bg-blue-50">Find your community â†’</Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-inkwell p-4 text-text-inverse">
              <p className="font-semibold">Plan an Event?</p>
              <p className="mt-2 text-xs leading-5 opacity-80">Organize campus activities and submit event proposals for approval.</p>
              <Link href="/club-coordinator/request-event" className="mt-4 inline-block rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-text transition hover:bg-secondary">Request an event</Link>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary">{(dashboardMode === "student" ? firstName : coordinatorInitial).charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{dashboardMode === "student" ? displayName || "Student" : coordinatorName}</p>
              <p className="truncate text-xs text-muted">{dashboardMode === "student" ? "Student account" : "Club Coordinator"}</p>
            </div>
            <Button type="button" onClick={handleLogout} disabled={isSigningOut} title="Log out" aria-label="Log out" className="rounded-lg p-2 ">{isSigningOut ? "â€¦" : "â†—"}</Button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[270px]">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
          <div className="flex min-h-[82px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" className="rounded-xl border border-border p-2.5 text-primary hover:bg-secondary lg:hidden">â˜°</button>
              <div>
                <p className="text-sm font-bold text-text">{dashboardMode === "student" ? "Student Dashboard" : "Club Coordinator Dashboard"}</p>
                <p className="hidden text-xs text-muted sm:block">{dashboardMode === "student" ? "Your personal campus space" : "Manage your club activities"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {dashboardMode === "student" && (
                <label className="hidden min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 md:flex">
                  <span className="text-muted">âŒ•</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-36 bg-transparent text-sm outline-none placeholder:text-subtle lg:w-48" />
                </label>
              )}

              {isCoordinator && (
                <button type="button" onClick={() => { setDashboardMode((mode) => mode === "student" ? "coordinator" : "student"); setMobileMenuOpen(false); }} className="rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:px-4">
                  <span className="sm:hidden">{dashboardMode === "student" ? "Coordinator â†’" : "â† Student"}</span>
                  <span className="hidden sm:inline">{dashboardMode === "student" ? "Switch to Coordinator" : "Switch to Student"}</span>
                </button>
              )}

              <Button type="button" onClick={handleLogout} disabled={isSigningOut} className="rounded-xl border border-border px-3 py-2.5 ">
                {isSigningOut ? "Signing out..." : <><span className="sm:hidden">â†—</span><span className="hidden sm:inline">Log out</span></>}
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
          {dashboardMode === "student" ? (
            <>
              <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-[#2c5bab] to-[#4777c7] px-6 py-8 text-white shadow-lg shadow-primary/10 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
                <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border-[40px] border-white/[0.06]" />
                <div className="pointer-events-none absolute -bottom-24 right-[22%] -z-10 h-48 w-48 rounded-full bg-white/[0.06]" />
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                  <div className="max-w-2xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90"><span className="h-2 w-2 rounded-full bg-green-300" />YOUR CAMPUS JOURNEY STARTS HERE</div>
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Hey, {firstName}! ðŸ‘‹<br /><span className="text-blue-100">Ready to make today count?</span></h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50/90 sm:text-base">Discover new opportunities, connect with your campus community, and make every college day meaningful.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href="/studentEvents" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50">Explore Events <span>â†’</span></Link>
                      <Link href="/student" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">Discover Clubs</Link>
                    </div>
                  </div>
                  <div className="hidden lg:flex"><div className="flex h-44 w-44 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm">ðŸŽ“</div></div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs text-blue-50/90"><span>ðŸ“š Learn something new</span><span>ðŸ¤ Meet your community</span><span>ðŸš€ Build your future</span></div>
              </section>

              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your overview</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Your campus at a glance</h2><p className="mt-1 text-sm text-muted">Everything you need for a productive campus life.</p></div>
                  <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">Student workspace</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {studentStats.map((stat) => <Link href={stat.href} key={stat.title} className="group rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"><div className="flex items-start justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${stat.color}`}>{stat.icon}</div><span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">â†’</span></div><p className="mt-5 text-sm font-medium text-muted">{stat.title}</p><span className="mt-1 block text-3xl font-extrabold tracking-tight">{stat.value}</span><p className="mt-2 text-xs text-subtle">{stat.description}</p></Link>)}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                <div className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Don't miss out</p><h2 className="mt-1 text-xl font-extrabold">Upcoming Events</h2><p className="mt-1 text-sm text-muted">What's happening around your campus.</p></div><Link href="/student/events" className="shrink-0 rounded-lg px-2 py-2 text-sm font-bold text-primary hover:bg-primary-subtle">View all â†’</Link></div>
                  <div className="mb-4 md:hidden"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" /></div>
                  <div className="space-y-4">
                    {filteredEvents.length ? filteredEvents.map((event) => <article key={event.id} className="group flex gap-4 rounded-2xl border border-border-subtle p-4 transition hover:border-primary/30 hover:bg-primary/[0.02]"><div className="flex w-[68px] shrink-0 flex-col items-center justify-center self-start rounded-xl bg-primary-subtle px-2 py-3 text-center"><span className="text-[10px] font-bold uppercase tracking-wider text-primary">{event.date.split(" ")[0]}</span><span className="mt-0.5 text-2xl font-extrabold text-primary">{event.date.split(" ")[1]}</span></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-text transition group-hover:text-primary">{event.name}</h3><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted">{event.category}</span></div><p className="mt-2 text-sm leading-6 text-muted">{event.description}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-subtle"><span>â—· {event.time}</span><span>âŒ– {event.venue}</span></div></div><span className="hidden text-2xl sm:block">{event.icon}</span></article>) : <div className="rounded-xl border border-dashed border-border p-8 text-center"><p className="text-2xl">ðŸ”Ž</p><p className="mt-2 font-semibold">No events found</p><p className="mt-1 text-sm text-muted">Try searching with a different keyword.</p></div>}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">Stay informed</p><h2 className="mt-1 text-xl font-extrabold">Campus Updates</h2><p className="mt-1 text-sm text-muted">The latest news and announcements.</p></div><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-xl">ðŸ“¢</div></div>
                  <div className="space-y-5">{announcements.map((announcement) => <article key={announcement.id} className="flex gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${announcement.color}`}>{announcement.icon}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">{announcement.title}</h3><span className="text-[10px] text-subtle">{announcement.date}</span></div><p className="mt-1 text-xs leading-5 text-muted">{announcement.message}</p><span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted">{announcement.type}</span></div></article>)}</div>
                  <Link href="/student/announcements" className="mt-6 flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-primary-subtle">View all announcements â†’</Link>
                </div>
              </section>

              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">Find your people</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Discover Campus Clubs</h2><p className="mt-1 text-sm text-muted">Meet people who share your interests.</p></div><Link href="/student/clubs" className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary-subtle">Explore all clubs â†’</Link></div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{clubs.map((club) => <article key={club.id} className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"><div className={`flex h-32 items-center justify-center bg-gradient-to-br ${club.color}`}><span className="text-5xl transition duration-300 group-hover:scale-110">{club.icon}</span></div><div className="p-5"><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">{club.category}</span><h3 className="mt-3 text-lg font-extrabold">{club.name}</h3><p className="mt-1 text-sm text-muted">{club.members}</p><Link href="/student/clubs" className="mt-5 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary-subtle">View club details <span>â†’</span></Link></div></article>)}</div>
              </section>

              <section>
                <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Get things done</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Quick Actions</h2><p className="mt-1 text-sm text-muted">Jump straight to what you need.</p></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{studentQuickActions.map((action) => <Link key={action.title} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-105 ${action.color}`}>{action.icon}</div><div className="min-w-0 flex-1"><h3 className="font-bold transition group-hover:text-primary">{action.title}</h3><p className="mt-1 text-xs leading-5 text-muted">{action.description}</p></div><span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">â†’</span></Link>)}</div>
              </section>

              <footer className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-xs text-subtle sm:flex-row sm:text-left"><p>Â© {new Date().getFullYear()} EduNex. Built for a better campus experience.</p><div className="flex items-center gap-4"><Link href="/student/profile" className="transition hover:text-primary">My Profile</Link><Link href="/student/issues" className="transition hover:text-primary">Help & Support</Link></div></footer>
            </>
          ) : (
            <>
              <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9">
                <div className="relative z-10 max-w-2xl"><p className="text-sm font-medium opacity-80">CLUB MANAGEMENT âœ¨</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Welcome back, {coordinatorName}!</h1><p className="mt-3 max-w-lg text-sm leading-6 opacity-90 sm:text-base">Manage your club activities, organize campus events, and keep students informed. Everything you need to coordinate your club is in one place.</p><Link href="/club-coordinator/request-event" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary">Request an Event <span>â†’</span></Link></div>
                <div className="pointer-events-none absolute -right-8 -top-12 text-[180px] opacity-15">ðŸŽ“</div>
              </section>

              <section><div><h2 className="text-2xl font-bold">Club Overview</h2><p className="mt-1 text-sm text-text-muted">A quick look at your club activities.</p></div>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{coordinatorStats.map((stat) => <Link key={stat.title} href={stat.href} className="block rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-text-muted">{stat.title}</p><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}>{stat.icon}</span></div><p className="mt-4 text-3xl font-bold">{stat.value}</p><p className="mt-2 text-xs text-text-subtle">View details â†’</p></Link>)}</div>
              </section>

              <div className="grid gap-8 xl:grid-cols-5">
                <section className="xl:col-span-3"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Upcoming Events</h2><p className="mt-1 text-sm text-text-muted">Stay updated with your club events.</p></div><Link href="/club-coordinator/events" className="shrink-0 text-sm font-semibold text-primary hover:underline">View all â†’</Link></div>
                  <div className="space-y-3">{coordinatorEvents.map((event) => <article key={event.title} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-primary hover:shadow-md sm:p-5"><div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary"><span className="text-xl font-bold">{event.date}</span><span className="text-xs font-semibold">{event.month}</span></div><div className="min-w-0 flex-1"><h3 className="font-semibold">{event.title}</h3><p className="mt-1 text-sm text-text-muted">Campus Event</p><span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${event.color}`}>{event.category}</span></div><div className="flex shrink-0 flex-col items-end gap-2"><span className={`rounded-full px-2 py-1 text-xs font-medium ${event.status === "Approved" ? "bg-primary-subtle text-primary" : "bg-secondary text-text-muted"}`}>{event.status}</span><Link href="/club-coordinator/events" aria-label={`View ${event.title}`} className="text-xl text-text-subtle hover:text-primary">â†’</Link></div></article>)}</div>
                </section>
                <section className="xl:col-span-2"><div><h2 className="text-xl font-bold">Recent Activities</h2><p className="mt-1 text-sm text-text-muted">Your latest club updates.</p></div><div className="mt-5 rounded-2xl border border-border bg-surface p-5">{activities.map((activity, index) => <article key={activity.title} className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${index !== activities.length - 1 ? "border-b border-border-subtle" : ""}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">{activity.icon}</div><div><h3 className="text-sm font-semibold leading-5">{activity.title}</h3><p className="mt-1 text-xs leading-5 text-text-muted">{activity.description}</p><p className="mt-2 text-xs text-primary">{activity.date}</p></div></article>)}</div></section>
              </div>

              <section><div><h2 className="text-2xl font-bold">Quick Actions</h2><p className="mt-1 text-sm text-text-muted">Jump directly to a club management service.</p></div><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{coordinatorQuickActions.map((action) => <Link key={action.title} href={action.href} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary hover:shadow-lg"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-2xl">{action.icon}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{action.title}</h3><p className="mt-1 text-sm text-text-muted">{action.description}</p></div><span className="text-lg text-primary">â†’</span></Link>)}</div></section>

              <footer className="border-t border-border pt-6 text-center text-sm text-text-muted">Â© {new Date().getFullYear()} EduNex Â· Your campus, connected.</footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
```


# FILE: apps\web\app\(student)\studentEvents\page.tsx
```
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAllEventsQuery } from "@/features/events/api/event-query";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// import { Link } from "lucide-react";

type CampusEvent = {
  id: string | number;
  title?: string | null;
  name?: string | null;
  description?: string | null;
  startDate?: string | Date | null;
  category?: string | null;
  venue?: string | null;
};

const eventThemes = [
  {
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
    light: "bg-blue-50 dark:bg-blue-950/30",
    icon: "ðŸŽ“",
  },
  {
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    light: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "ðŸŽ‰",
  },
  {
    gradient: "from-violet-600 via-purple-600 to-fuchsia-700",
    light: "bg-violet-50 dark:bg-violet-950/30",
    icon: "ðŸ’¡",
  },
  {
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    light: "bg-orange-50 dark:bg-orange-950/30",
    icon: "ðŸ†",
  },
];

function formatEventDate(date?: string | Date | null) {
  if (!date) return "Date to be announced";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date to be announced";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentEventsPage() {
  const router = useRouter();
  const { data, isPending, isError } = useAllEventsQuery();
  const [search, setSearch] = useState("");

  const events: CampusEvent[] = Array.isArray(data)
    ? data
    : (data as { events?: CampusEvent[] } | undefined)?.events ?? [];

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) =>
      [
        event.title,
        event.name,
        event.description,
        event.category,
        event.venue,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [events, search]);

  if (isPending) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-64 rounded-[2rem] bg-muted/30" />
          <div className="h-14 max-w-md rounded-2xl bg-muted/30" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 rounded-3xl border border-border bg-surface"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl dark:bg-red-950/30">
            !
          </div>
          <h2 className="mt-5 text-xl font-bold">We couldn't load the events</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Top navigation */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-md">
              E
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">EduNex</p>
              <p className="text-xs text-muted">Student portal</p>
            </div>
          </div>

          <Link
  href="/studentDashboard"
  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-muted shadow-sm transition-all duration-200 hover:-translate-x-1 hover:border-primary hover:bg-primary/5 hover:text-primary"
>
  <ArrowLeft size={18} aria-hidden="true" />
  <span>Back to Dashboard</span>
</Link>
        </div>

        {/* Hero */}
        <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 px-5 py-6 text-white shadow-xl shadow-indigo-950/10 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute right-12 top-12 hidden text-7xl opacity-10 sm:block">
            âœ¦
          </div>

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              CAMPUS LIFE Â· STUDENT COMMUNITY
            </div>

            <h1 className="mt-6 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Make campus
              <br />
              <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-violet-300 bg-clip-text text-transparent">
                unforgettable.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Discover workshops, cultural celebrations, competitions, and
              opportunities to connect with your campus community.
            </p>

            <button
              onClick={() =>
                document.getElementById("event-list")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Explore all events
              <span aria-hidden="true">â†“</span>
            </button>
          </div>

          <div className="relative mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:mt-11 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">
              <p className="text-3xl font-extrabold">{events.length}</p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Total events
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">
              <p className="text-3xl font-extrabold">
                {new Set(events.map((event) => event.category).filter(Boolean)).size}
              </p>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Event categories
              </p>
            </div>
          </div>
        </section>

        {/* Events heading and search */}
        <section id="event-list" className="scroll-mt-6 pt-10 sm:pt-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Find your next experience
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Explore campus events
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Something exciting is happening. Find your place in it.
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events, categories, venues..."
                aria-label="Search campus events"
                className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-b border-border pb-4">
            <p className="text-sm text-muted">
              <span className="font-bold text-foreground">
                {filteredEvents.length}
              </span>{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>

                    {/* Event cards using reusable Card component */}
          {filteredEvents.length === 0 ? (
            <Card className="my-8 border-dashed py-16 text-center" padding="lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl dark:bg-blue-950/30">
                ðŸ“…
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {search ? "No matching events" : "No events available yet"}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {search
                  ? "Try another keyword or clear your search."
                  : "New campus events will appear here when available."}
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear search
                </button>
              )}
            </Card>
          ) : (
            <div className="grid gap-5 pt-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event, index) => {
                const theme = eventThemes[index % eventThemes.length];

                return (
                  <Card
                    key={event.id}
                    padding="sm"
                    className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl"
                  >
                    {/* Event banner */}
                    <div
                      className={`relative flex h-40 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient}`}
                    >
                      <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[22px] border-white/10 transition duration-500 group-hover:scale-110" />

                      <div className="absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-white/10 blur-sm" />

                      <span className="relative text-6xl transition duration-300 group-hover:scale-110">
                        {theme.icon}
                      </span>

                      <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        {event.category || "Campus event"}
                      </span>
                    </div>

                    {/* Event details */}
                    <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                      <h3 className="line-clamp-2 text-lg font-bold leading-snug transition group-hover:text-blue-600">
                        {event.title || event.name || "Untitled event"}
                      </h3>

                      <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted">
                        {event.description ||
                          "Join your campus community and be part of this experience."}
                      </p>

                      <div className="mt-5 space-y-4 border-t border-border pt-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${theme.light}`}
                          >
                            ðŸ“…
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs text-muted">Event date</p>
                            <p className="mt-1 break-words text-sm font-semibold">
                              {formatEventDate(event.startDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${theme.light}`}
                          >
                            ðŸ“
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs text-muted">Venue</p>
                            <p className="mt-1 break-words text-sm font-semibold">
                              {event.venue || "Venue to be announced"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 mt-5">
                        <span className="text-xs font-medium text-muted">
                          EduNex Events
                        </span>

                        <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition group-hover:gap-3">
                          Discover <span aria-hidden="true">â†’</span>
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t border-border py-7 text-center">
          <p className="text-sm font-semibold">
            EduNex <span className="text-blue-600">Â·</span> Your campus, connected.
          </p>
          <p className="mt-2 text-xs text-muted">
            Discover opportunities. Connect with your community.
          </p>
        </footer>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\(student)\studentprofile\page.tsx
```

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateStudentProfile,
  useStudentProfile,
} from "@/features/students/api/student-query";

// import { studentProfileSchema } from "@/lib/validations/studentProfileSchema";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import PageHeader from "@/components/ui/page-header";
import { studentProfileSchema } from "@/features/students/validation/student-profile-schema";
import { Department } from "@/features/departments/api/department";
import { useDepartment } from "@/features/departments/api/department-query";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";


const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const selectClass =
  "mt-1.5 w-full cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type FormErrors = Partial<
  Record<
    "admissionNumber" | "departmentId" | "semester" | "phone",
    string
  >
>;

export default function StudentProfile() {
  const router = useRouter();
  const profileQuery = useStudentProfile();
  const createProfile = useCreateStudentProfile();

  const departmentQuery = useDepartment();

const departments: Department[] = Array.isArray(departmentQuery.data)
  ? departmentQuery.data
  : [];

  const [formData, setFormData] = useState({
  admissionNumber: "",
  departmentId: "",
  semester: "",
  phone: undefined as string | undefined,
});

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setServerError("");
    createProfile.reset();
  };


  const handlePhoneChange = (value?: string) => {
  setFormData((prev) => ({
    ...prev,
    phone: value,
  }));

  setErrors((prev) => ({
    ...prev,
    phone: undefined,
  }));

  setServerError("");
  createProfile.reset();
};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = studentProfileSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          field in formData &&
          !fieldErrors[field as keyof FormErrors]
        ) {
          fieldErrors[field as keyof FormErrors] = issue.message;
        }
      }

      setErrors(fieldErrors);
      setServerError("");
      return;
    }

    if (
  !formData.phone ||
  !isPossiblePhoneNumber(formData.phone)
) {
  setErrors((prev) => ({
    ...prev,
    phone: "Enter a valid international phone number.",
  }));
  return;
}

    setErrors({});
    setServerError("");

    createProfile.mutate(
  {
    admissionNumber: validation.data.admissionNumber,
    departmentId: validation.data.departmentId,
    semester: validation.data.semester,
    phone: validation.data.phone,
  },
      {
        onSuccess: () => {
          router.push("/studentDashboard");
        },
        onError: (error: any) => {
          const status = error.response?.status;
          const message = error.response?.data?.message;

          if (status === 409) {
            setErrors((prev) => ({
              ...prev,
              admissionNumber:
                message || "This student profile already exists.",
            }));
            return;
          }

          setServerError(
            message || "Unable to save your profile. Please try again."
          );
        },
      }
    );
  };

  if (profileQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-roobert">
        <Card className="text-center" padding="lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary-subtle border-t-primary" />
          <p className="text-label font-medium text-text-muted">
            Loading your student profile...
          </p>
        </Card>
      </main>
    );
  }

  if (profileQuery.isError) {
    const status = (profileQuery.error as any).response?.status;

    if (status !== 404) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
          <Card padding="lg" className="text-center">
            <p className="text-text">
              Unable to load your student profile.
            </p>
            <Button
              type="button"
              className="mt-4"
              onClick={() => profileQuery.refetch()}
            >
              Try again
            </Button>
          </Card>
        </main>
      );
    }
  }

  if (profileQuery.data?.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 font-roobert">
        <Card className="w-full max-w-md text-center" padding="lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-3xl text-primary">
            âœ“
          </div>

          <h1 className="text-heading-sm font-bold text-text">
            Profile Already Exists
          </h1>

          <p className="mt-2 text-label text-text-muted">
            Your student profile is already set up.
          </p>

          <Button
            type="button"
            className="mt-6 w-full"
            onClick={() => router.push("/studentDashboard")}
          >
            Go to Dashboard
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-3 py-4 font-roobert text-text sm:px-4 sm:py-6">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-subtle blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary-hover/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        <PageHeader
          className="mb-5"
          eyebrow="EduNex Â· Campus Management"
          title={
            <>
              Complete Your{" "}
              <span className="text-primary">Student Profile</span>
            </>
          }
          description="Just a few more details to get your campus journey started."
        />

        <Card className="mb-5 flex items-center gap-3" padding="sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-xl">
            ðŸŽ“
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-label font-semibold text-text">
                Student information
              </p>
              <span className="text-caption font-medium text-primary">
                Profile setup
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary-hover">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="mb-5 border-b border-border-subtle pb-4">
            <h2 className="text-subheading font-bold text-text">
              Academic details
            </h2>
            <p className="mt-1 text-label text-text-muted">
              Enter your official college details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="admissionNumber"
                className="text-label font-semibold text-text"
              >
                Admission number
                <span className="ml-1 text-red-500">*</span>
              </label>

              <Input
                id="admissionNumber"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                placeholder="e.g. EDU2026001"
                autoComplete="off"
                required
                aria-invalid={!!errors.admissionNumber}
                aria-describedby={
                  errors.admissionNumber
                    ? "admissionNumber-error"
                    : undefined
                }
                className="mt-1.5"
              />

              {errors.admissionNumber ? (
                <p id="admissionNumber-error" className="mt-1 text-sm text-red-600">
                  {errors.admissionNumber}
                </p>
              ) : (
                <p className="mt-1.5 text-caption text-text-subtle">
                  Enter the admission number issued by your college.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="departmentId"
                className="text-label font-semibold text-text"
              >
                Department
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
  id="departmentId"
  name="departmentId"
  value={formData.departmentId}
  onChange={handleChange}
  required
  aria-invalid={!!errors.departmentId}
  aria-describedby={
    errors.departmentId ? "departmentId-error" : undefined
  }
  className={selectClass}
>
  <option value="">Choose your department</option>

  {departments.map((department: Department) => (
    <option key={department.id} value={String(department.id)}>
      {department.name}
    </option>
  ))}
</select>

{departmentQuery.isLoading && (
  <p className="mt-1 text-sm text-text-muted">
    Loading departments...
  </p>
)}

{departmentQuery.isError && (
  <p className="mt-1 text-sm text-red-600">
    Unable to load departments. Please try again.
  </p>
)}

{errors.departmentId && (
  <p id="departmentId-error" className="mt-1 text-sm text-red-600">
    {errors.departmentId}
  </p>
)}
            </div>

            <div>
              <label
                htmlFor="semester"
                className="text-label font-semibold text-text"
              >
                Current semester
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                aria-invalid={!!errors.semester}
                aria-describedby={
                  errors.semester ? "semester-error" : undefined
                }
                className={selectClass}
              >
                <option value="">Choose your semester</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>

              {errors.semester && (
                <p id="semester-error" className="mt-1 text-sm text-red-600">
                  {errors.semester}
                </p>
              )}
            </div>

            <div>
  <label
    htmlFor="phone"
    className="text-label font-semibold text-text"
  >
    Phone number
    <span className="ml-1 text-red-500">*</span>
  </label>

  <PhoneInput
    id="phone"
    international
    defaultCountry="IN"
    value={formData.phone}
    onChange={handlePhoneChange}
    placeholder="Enter phone number"
    autoComplete="tel"
    className="mt-1.5"
  />

  {errors.phone && (
    <p className="mt-1 text-sm text-red-600">
      {errors.phone}
    </p>
  )}
</div>

            {(serverError || createProfile.isError) && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <p className="font-semibold">
                  Unable to save your profile
                </p>
                <p className="mt-1">
                  {serverError || "Please check your details and try again."}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={createProfile.isPending}
              className="w-full"
              size="lg"
            >
              {createProfile.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                  Saving profile...
                </>
              ) : (
                <>
                  Save Profile
                  <span aria-hidden="true">â†’</span>
                </>
              )}
            </Button>

            <p className="text-center text-caption leading-relaxed text-text-subtle">
              Your information will be saved to your EduNex student profile.
            </p>
          </form>
        </Card>

        <p className="mt-5 text-center text-caption text-text-subtle">
          EduNex Â· Connecting students, faculty, and campus life.
        </p>
      </div>
    </main>
  );
}
```


# FILE: apps\web\app\club-coordinator\events\page.tsx
```
"use client";

import { useMemo, useState } from "react";
import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  useAllEventsQuery,
  useMyEventsQuery,
} from "../../../features/events/api/event-query";
type EventTab = "All" | "My Events";

const gradients = [
  "from-[#234c96] via-[#315eaa] to-[#7898d6]",
  "from-[#234c96] via-[#536eb4] to-[#a1b5e5]",
  "from-[#19396f] via-[#234c96] to-[#f28520]",
];

export default function BrowseEventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<EventTab>("All");

  const allEventsQuery = useAllEventsQuery();
  const myEventsQuery = useMyEventsQuery();

  const activeQuery = category === "All" ? allEventsQuery : myEventsQuery;
  const events = activeQuery.data ?? [];

  const filteredEvents = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return events.filter((event) => {
      const searchableText = [
        event.title,
        event.clubName,
        event.location ?? "",
        event.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [events, search]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <CoordinatorLayout>
      <div className="space-y-7 pb-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#19396f] via-[#234c96] to-[#315eaa] px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-[#f28520]/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50">
              <span className="h-2 w-2 rounded-full bg-[#f28520]" />
              CAMPUS LIFE Â· EVENTS
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Discover what&apos;s
              <span className="block text-orange-300">happening on campus.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Find exciting events, connect with your campus community, and
              never miss an opportunity to participate.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">{filteredEvents.length}</p>
                <p className="mt-1 text-xs text-blue-100">
                  {search ? "Matching events" : "Events displayed"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-sm">
                <p className="text-2xl font-bold">
                  {category === "All" ? "Campus" : "Your clubs"}
                </p>
                <p className="mt-1 text-xs text-blue-100">Explore together</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-text">Find your next event</h2>
            <p className="mt-1 text-sm text-text-muted">
              Search events by title, club, or venue.
            </p>
          </div>

          <Card className="border-border-subtle p-3 shadow-subtle sm:p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative min-w-0 flex-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-subtle"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events, clubs, venues..."
                  aria-label="Search events"
                  className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-sm text-text outline-none transition placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="flex rounded-xl bg-background p-1">
                {(["All", "My Events"] as const).map((tab) => (
                  <Button
                    key={tab}
                    type="button"
                    onClick={() => setCategory(tab)}
                    aria-pressed={category === tab}
                    className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                      category === tab
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-muted hover:bg-surface hover:text-text"
                    }`}
                  >
                    {tab === "All" ? "All Events" : "My Events"}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-text">
                {category === "All" ? "Campus events" : "Events from your clubs"}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1 ? "event" : "events"} found
              </p>
            </div>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm font-semibold text-primary transition hover:text-primary-hover"
              >
                Clear search
              </button>
            )}
          </div>

          {activeQuery.isPending ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-border-subtle bg-surface"
                >
                  <div className="h-36 animate-pulse bg-primary/10" />
                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-border-subtle" />
                    <div className="h-4 animate-pulse rounded bg-border-subtle" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-border-subtle" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeQuery.isError ? (
            <Card className="border-dashed py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
                !
              </div>
              <h3 className="mt-4 font-bold text-text">Unable to load events</h3>
              <p className="mt-2 text-sm text-text-muted">
                Please check your connection and try again.
              </p>
              <Button className="mt-5" onClick={() => activeQuery.refetch()}>
                Try again
              </Button>
            </Card>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <div
                    className={`relative flex h-40 items-end overflow-hidden bg-gradient-to-br ${
                      gradients[index % gradients.length]
                    } p-5`}
                  >
                    <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border-[20px] border-white/10 transition duration-500 group-hover:scale-110" />
                    <div className="pointer-events-none absolute bottom-0 right-12 h-20 w-20 rounded-full bg-white/10 blur-xl" />

                    <div className="relative z-10 flex w-full items-end justify-between gap-3">
                      <span className="max-w-[75%] truncate rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        {event.clubName}
                      </span>
                      <span className="shrink-0 text-xs font-medium text-white/80">
                        EVENT
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold leading-snug text-text transition group-hover:text-primary">
                        {event.title}
                      </h3>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold capitalize text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                        {event.status}
                      </span>
                    </div>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-text-muted">
                      {event.description || "Discover the details of this campus event."}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-border-subtle pt-4">
                      <div className="flex items-start gap-3 text-sm">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-xs text-text-subtle">Date</p>
                          <p className="mt-0.5 font-semibold text-text">
                            {formatDate(event.startTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-sm">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#d96f12]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>
                        </span>
                        <div>
                          <p className="text-xs text-text-subtle">Time</p>
                          <p className="mt-0.5 font-semibold text-text">
                            {formatTime(event.startTime)} â€“ {formatTime(event.endTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-sm">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
                            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-text-subtle">Venue</p>
                          <p className="mt-0.5 break-words font-semibold text-text">
                            {event.location || "Venue not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-border-subtle pt-4">
                      <span className="text-xs text-text-subtle">
                        Campus community
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
                        Event details
                        <span aria-hidden="true">â†’</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-border py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-8 w-8" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M16 3v4M8 3v4M3 10h18M9 15h2" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-text">No events found</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-muted">
                {search
                  ? "Try a different search term or clear your search."
                  : category === "All"
                    ? "There are no published campus events yet."
                    : "There are no published events for your assigned clubs."}
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Reset filters
              </Button>
            </Card>
          )}
        </section>
      </div>
    </CoordinatorLayout>
  );
}
```


# FILE: apps\web\app\club-coordinator\profile\page.tsx
```

"use client";

import { useState } from "react";
import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
export default function CoordinatorProfilePage() {
  const [editing, setEditing] = useState(false);

  return (
    <CoordinatorLayout>
      <div className="mb-7">
        <p className="text-sm font-medium text-indigo-600">Your account</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          View your coordinator and department information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-36 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 sm:h-44" />

        <div className="px-5 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-3xl font-bold text-indigo-700 shadow-sm sm:h-28 sm:w-28">
              AJ
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="rounded-xl border border-indigo-200 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              {editing ? "Cancel editing" : "âœŽ Edit Profile"}
            </button>
          </div>

          <div className="mt-5">
            <h2 className="text-2xl font-bold text-slate-900">Alex Johnson</h2>
            <p className="mt-1 text-sm text-slate-500">Club Coordinator Â· Student Activities</p>
            <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              â— Active account
            </span>
          </div>

          {editing && (
            <div role="status" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Profile editing is a UI preview only. Changes are not saved.
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-7">
            <h3 className="font-semibold text-slate-900">Personal Information</h3>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { label: "Full Name", value: "Alex Johnson" },
                { label: "Email Address", value: "alex.johnson@example.edu" },
                { label: "Phone Number", value: "+91 98765 43210" },
                { label: "Coordinator ID", value: "CC-2026-001" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-2 break-words text-sm font-medium text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-7">
            <h3 className="font-semibold text-slate-900">Club & Department</h3>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { label: "Club Name", value: "Technology Club" },
                { label: "Department", value: "Computer Science" },
                { label: "Institution", value: "EduNex University" },
                { label: "Academic Year", value: "2026â€“2027" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Events Organized", value: "16" },
          { label: "Upcoming Events", value: "08" },
          { label: "Pending Requests", value: "03" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </CoordinatorLayout>
  );
}
```


# FILE: apps\web\app\club-coordinator\request-event\page.tsx
```

"use client";

import { useState } from "react";
import CoordinatorLayout from "@/features/coordinator/components/coordinator-layout";
export default function RequestEventPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <CoordinatorLayout>
      <div className="mb-7">
        <p className="text-sm font-medium text-indigo-600">Plan something great</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Request for Event
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Share your proposal for an upcoming campus event.
        </p>
      </div>

      {submitted && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <span className="text-xl">âœ“</span>
          <div>
            <p className="font-semibold">Demo submission successful!</p>
            <p className="mt-1 text-sm">
              This is a static UI. Your request has not been saved to the server.
            </p>
            <button onClick={() => setSubmitted(false)} className="mt-2 text-sm font-semibold underline">
              Submit another request
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 xl:col-span-2">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="font-semibold text-slate-900">Event information</h2>
            <p className="mt-1 text-sm text-slate-500">Fields marked with * are required.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="eventName" className="mb-2 block text-sm font-medium text-slate-700">
                Event title *
              </label>
              <input id="eventName" name="eventName" required placeholder="e.g. Annual TechFest" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
                Event category *
              </label>
              <select id="category" name="category" required defaultValue="" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500">
                <option value="" disabled>Select category</option>
                <option>Technology</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Workshop</option>
                <option>Academic</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="attendees" className="mb-2 block text-sm font-medium text-slate-700">
                Expected attendees *
              </label>
              <input id="attendees" name="attendees" type="number" min="1" required placeholder="e.g. 150" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label htmlFor="eventDate" className="mb-2 block text-sm font-medium text-slate-700">
                Proposed date *
              </label>
              <input id="eventDate" name="eventDate" type="date" min={new Date().toLocaleDateString("en-CA")} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
            </div>

            <div>
              <label htmlFor="eventTime" className="mb-2 block text-sm font-medium text-slate-700">
                Proposed time *
              </label>
              <input id="eventTime" name="eventTime" type="time" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="venue" className="mb-2 block text-sm font-medium text-slate-700">
                Preferred venue *
              </label>
              <input id="venue" name="venue" required placeholder="e.g. Main Auditorium" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                Event description *
              </label>
              <textarea id="description" name="description" required minLength={20} rows={5} placeholder="Describe the event, its purpose, activities, and expected outcomes..." className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button type="reset" onClick={() => setSubmitted(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Clear form
            </button>
            <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              Submit Event Request â†’
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-indigo-600 p-6 text-white">
            <div className="text-3xl">âœ¦</div>
            <h2 className="mt-4 text-lg font-bold">Bring your idea to life</h2>
            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Share a clear proposal so the college can review your event requirements.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">Before you submit</h2>
            <ul className="mt-4 space-y-4 text-sm leading-5 text-slate-600">
              <li className="flex gap-3"><span className="font-bold text-indigo-600">01</span><span>Choose a suitable date and venue.</span></li>
              <li className="flex gap-3"><span className="font-bold text-indigo-600">02</span><span>Include a realistic attendee estimate.</span></li>
              <li className="flex gap-3"><span className="font-bold text-indigo-600">03</span><span>Explain the purpose and activities clearly.</span></li>
              <li className="flex gap-3"><span className="font-bold text-indigo-600">04</span><span>Wait for approval before treating the event as confirmed.</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">Demo mode</p>
            <p className="mt-2 text-sm leading-5 text-amber-800">
              Requests submitted here are not persisted. Backend integration will come later.
            </p>
          </div>
        </aside>
      </div>
    </CoordinatorLayout>
  );
}
```


# FILE: apps\web\components\layout\mode-switch.tsx
```
"use client";

import { useAccess } from "@/lib/navigation/access";

// Shown only for accounts that are both Student and Club Coordinator.
export function ModeSwitch() {
  const { canSwitchMode, mode, setMode } = useAccess();

  if (!canSwitchMode) return null;

  const next = mode === "student" ? "coordinator" : "student";

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium transition hover:bg-background"
    >
      {mode === "student" ? "Switch to Coordinator" : "Switch to Student"}
    </button>
  );
}
```


# FILE: apps\web\components\ui\button.tsx
```

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-hover",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
    accent:
      "bg-accent text-accent-foreground hover:bg-accent-hover",
    outline:
      "border border-border bg-surface text-text hover:bg-secondary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-caption",
    md: "px-4 py-2 text-label",
    lg: "px-5 py-3 text-label",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
```


# FILE: apps\web\components\ui\card.tsx
```

import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

export default function Card({
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-subtle ${paddingStyles[padding]} ${className}`}
      {...props}
    />
  );
}
```


# FILE: apps\web\components\ui\input.tsx
```

import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-label text-text outline-none transition placeholder:text-text-subtle hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
```


# FILE: apps\web\components\ui\page-header.tsx
```
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  description?: string;
  eyebrow?: string;
  className?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  eyebrow,
  className = "",
  action,
}: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div>
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}

        <h1 className="text-heading-sm font-extrabold tracking-tight text-text">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-label leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
```


# FILE: apps\web\features\auth\api\auth-query.ts
```
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./current-user";

export const CurrentUserKey = ["current-user"];

export const useCurrentUser = () => {
  return useQuery({
    queryKey: CurrentUserKey,
    queryFn: getCurrentUser,
    retry: false,
  });
};
```


# FILE: apps\web\features\auth\api\current-user.ts
```
import { api } from "@/lib/axios";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface UserRole {
  id: number;
  name: string;
  slug: string;
}

export interface StudentProfile {
  id: number;
  departmentId: number;
}

export interface StaffProfile {
  id: number;
  role: string;
  employeeId: string;
  departmentId: number | null;
  designation: string | null;
}

export interface CoordinatedClub {
  id: number;
  name: string;
}

export interface CurrentUserData {
  user: CurrentUser | null;
  roles: UserRole[];
  isSuperAdmin: boolean;
  permissions: string[];
  hasStudentProfile: boolean;
  studentProfile: StudentProfile | null;
  staffProfile: StaffProfile | null;
  coordinatedClubs: CoordinatedClub[];
}

export interface CurrentUserResponse {
  success: boolean;
  data: CurrentUserData;
}

export const getCurrentUser = async (): Promise<CurrentUserData> => {
  const response = await api.get<CurrentUserResponse>("/me");

  return response.data.data;
};
```


# FILE: apps\web\features\auth\components\reset-password-form.tsx
```
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid or missing reset link. Please request a new email.",
      );
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        setError(
          result.error.message || "Unable to reset password.",
        );
        return;
      }

      setSuccess(
        "Password created successfully! You can now log in.",
      );
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fc] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-[#234c96]">
          Set Your Password
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Create a password for your EduNex account.
        </p>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {success ? (
          <div>
            <p className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-lg bg-[#234c96] px-4 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Go to HOD Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                New Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your new password"
                minLength={8}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#234c96]"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Enter your password again"
                minLength={8}
                autoComplete="new-password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#234c96]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full rounded-lg bg-[#234c96] px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Setting Password..." : "Create Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
```


# FILE: apps\web\features\auth\components\role-login-form.tsx
```

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import {
  type LoginFormValues,
  loginSchema,
} from "@/features/auth/validation/login-schema";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";

type RoleLoginFormProps = {
  title: string;
  description: string;
  dashboardPath: string;
};

export default function RoleLoginForm({
  title,
  description,
  dashboardPath,
}: RoleLoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setServerError("");

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setServerError(error.message || "Invalid email or password.");
        return;
      }

      router.push(dashboardPath);
      router.refresh();
    } catch {
      setServerError(
        "Unable to log in. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md border border-border bg-surface p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            E
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            EduNex Campus
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-text">
            {title}
          </h1>

          <p className="mt-2 text-sm text-text-muted">{description}</p>
        </div>

        <form
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-text"
            >
              Work email
            </label>

            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@college.edu"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              className="w-full"
            />

            {errors.email && (
              <p id="email-error" className="mt-1.5 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text"
            >
              Password
            </label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
                className="w-full pr-20"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing in..." : "Sign in to EduNex"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-text-subtle">
          Your account is provided by your institution. Public registration is
          not available.
        </p>

        <p className="mt-5 border-t border-border-subtle pt-5 text-center text-xs text-text-subtle">
          Â© {new Date().getFullYear()} EduNex Campus Management
        </p>
      </Card>
    </main>
  );
}
```


# FILE: apps\web\features\auth\validation\login-schema.ts
```

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```


# FILE: apps\web\features\auth\validation\register-schema.ts
```

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
```


# FILE: apps\web\features\clubs\api\club-query.ts
```

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { createClub, createStudentMembershipRequest, getClubs, getMyStudentMembershipRequests, getStudentClubAnnouncements, getStudentClubById, getStudentClubCoordinators, getStudentClubEvents, getStudentClubs } from "@/features/clubs/api/clubs";
import type { CreateClubInput } from "@/features/clubs/validation/club-schema";


type QueryRetry =
  | boolean
  | number
  | ((failureCount: number, error: Error) => boolean);

export const useClubsQuery = (retry?: QueryRetry) => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
    ...(retry !== undefined ? { retry } : {}),
  });
};

export const useCreateClubMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClubInput) => createClub(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["clubs"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["student-clubs"],
      });
    },
  });
};



export const useStudentClubsQuery =()=>{
  return useQuery({
    queryKey:["student-clubs"],
    queryFn:getStudentClubs
  })
}


export const useStudentClubByIdQuery =(clubId:number)=>{
  return useQuery({
    queryKey:["student-clubs",clubId],
    queryFn:()=>getStudentClubById(clubId),
    enabled:Number.isFinite(clubId)&&clubId>0,
  })
}


export const useStudentClubCoordinatorsQuery =(clubId:number)=>{
  return useQuery({
    queryKey:["student-clubs",clubId,"coordinators"],
    queryFn:()=>getStudentClubCoordinators(clubId),
    enabled:Number.isFinite(clubId)&&clubId>0
  })
}


export const useStudentClubEventsQuery =(clubId:number)=>{
  return useQuery({
    queryKey:["student-clubs",clubId,"events"],
    queryFn:()=>getStudentClubEvents(clubId),
    enabled:Number.isFinite(clubId)&&clubId>0
  })
}


export const useStudentClubAnnouncementsQuery = (clubId: number) => {
  return useQuery({
    queryKey: ["student-clubs", clubId, "announcements"],
    queryFn: () => getStudentClubAnnouncements(clubId),
    enabled: Number.isFinite(clubId) && clubId > 0,
  });
};


export const useMyStudentMembershipRequestsQuery = () => {
  return useQuery({
    queryKey: ["student-memberships"],
    queryFn: getMyStudentMembershipRequests,
  });
};


export const useCreateStudentMembershipRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId: number) =>
      createStudentMembershipRequest(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["student-memberships"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["student-clubs"],
      });
    },
  });
};



```


# FILE: apps\web\features\clubs\api\clubs.ts
```

import axios from "axios";
import { api } from "../../../lib/axios";
import type { CreateClubInput } from "@/features/clubs/validation/club-schema";

export interface Club {
  id: number;
  name: string;
  description: string | null;
  departmentId: number | null;
}

export interface ClubMembershipRequest {
  id:number,
  clubId:number,
  status:string,
  club?:Club
}

export interface ClubEvent{
  id:number,
  title: string;
  description?: string | null;
  startDate?: string;
  date?: string;
}

export interface ClubAnnouncement {
  id: number;
  title: string;
  content?: string;
  message?: string;
  createdAt?: string;
}

export interface ClubCoordinator {
  id: number;
  name: string;
  email?: string;
}







export const getClubs = async (): Promise<Club[]> => {

    const response = await api.get("/clubs");
    return response.data.data;
 
};


export const createClub=async(data:CreateClubInput,):Promise<Club>=>{
 
    const response=await api.post("/clubs",data)
    return response.data.data
 
}


export const getStudentClubs = async (): Promise<Club[]> => {

    const response = await api.get("/clubs/student");
    return response.data.data;
  
};



export const getStudentClubById =async(clubId:number,):Promise<Club>=>{
  
    const response = await api.get(`/clubs/student/${clubId}`);
    return response.data.data;
  
}


  export const getStudentClubCoordinators  =async(clubId:number):Promise<ClubCoordinator[]>=>{
 
      const response = await api.get(`/clubs/student/${clubId}/coordinators`);
      return response.data.data;
    
  }


  export const getStudentClubEvents = async (
  clubId: number,
): Promise<ClubEvent[]> => {

    const response = await api.get(`/clubs/student/${clubId}/events`);
    return response.data.data;
  
};



export const getStudentClubAnnouncements = async (
  clubId: number
): Promise<ClubAnnouncement[]> => {

    const response = await api.get(
      `/clubs/student/${clubId}/announcements`
    );

    return response.data.data;
 
};



export const createStudentMembershipRequest = async (
  clubId: number,
): Promise<ClubMembershipRequest> => {
  
    const response = await api.post(`/clubs/student/${clubId}/membership`,);
    return response.data.data;

};


export const getMyStudentMembershipRequests = async (): Promise<
  ClubMembershipRequest[]
> => {
 
    const response = await api.get("/clubs/student/my/memberships");
    return response.data.data;
  
};
```


# FILE: apps\web\features\clubs\components\club-card.tsx
```
import Link from "next/link";
import type { Club } from "@/features/clubs/api/clubs";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="group flex h-full flex-col transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-xl font-bold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
      </div>

      <h2 className="text-subheading font-bold text-text">
        {club.name}
      </h2>

      <p className="mt-2 min-h-12 flex-1 text-label leading-relaxed text-text-muted">
        {club.description ||
          "Explore activities and connect with students on campus."}
      </p>

      <div className="mt-6">
        <Link href={`/student/${club.id}`} className="block">
          <Button type="button" className="w-full">
            View Club
            <span aria-hidden="true">â†’</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
```


# FILE: apps\web\features\clubs\components\club-management-view.tsx
```
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  useClubsQuery,
  useCreateClubMutation,
} from "@/features/clubs/api/club-query";
import {
  createClubSchema,
  type CreateClubInput,
} from "@/features/clubs/validation/club-schema";

export default function ClubManagementView() {
  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const form = useForm<CreateClubInput>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const clubsQuery = useClubsQuery();
  const createClubMutation = useCreateClubMutation();

  const onSubmit = (values: CreateClubInput) => {
    createClubMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  if (sessionPending) {
    return <main className="p-8">Checking your session...</main>;
  }

  if (!session?.user) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Clubs</h1>
        <p className="mt-2 text-gray-600">
          Please log in to access club management.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <p className="text-sm font-semibold text-[#234c96]">
            EDUNEX / CLUB MANAGEMENT
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Clubs
          </h1>
          <p className="mt-2 text-gray-600">
            Create and view college clubs.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            Create a club
          </h2>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5 space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Club name
              </label>
              <input
                id="name"
                {...form.register("name")}
                placeholder="e.g. Coding Club"
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#234c96]"
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                {...form.register("description")}
                rows={3}
                placeholder="Describe the club (optional)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#234c96]"
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {createClubMutation.isError && (
              <p role="alert" className="text-sm text-red-600">
                {createClubMutation.error.message}
              </p>
            )}

            {createClubMutation.isSuccess && (
              <p role="status" className="text-sm text-green-700">
                Club created successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={createClubMutation.isPending}
              className="rounded-lg bg-[#234c96] px-5 py-2.5 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {createClubMutation.isPending
                ? "Creating..."
                : "Create club"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Existing clubs
          </h2>

          {clubsQuery.isPending ? (
            <p className="text-gray-600">Loading clubs...</p>
          ) : clubsQuery.isError ? (
            <div>
              <p role="alert" className="text-red-600">
                {clubsQuery.error.message}
              </p>
              <button
                type="button"
                onClick={() => void clubsQuery.refetch()}
                className="mt-2 text-sm font-medium text-[#234c96]"
              >
                Try again
              </button>
            </div>
          ) : clubsQuery.data.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              No clubs have been created yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {clubsQuery.data.map((club) => (
                <article
                  key={club.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {club.name}
                    </h3>
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-[#234c96]">
                      ID: {club.id}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {club.description || "No description provided."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
```


# FILE: apps\web\features\clubs\validation\club-schema.ts
```

import { z } from "zod";

export const createClubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Club name is required.")
    .max(150, "Club name cannot exceed 150 characters."),
  description: z.string().trim().optional(),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
```


# FILE: apps\web\features\coordinator\api\coordinator-query.ts
```
import { isAxiosError } from "axios";
import {
  createCoordinator,
  getCoordinatorAssignments,
  getCoordinatorStatus,
  type CreateCoordinatorInput,
} from "@/features/coordinator/api/coordinators";
import { getHodStudents } from "@/features/hod/api/hod";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const retryUnlessAuthError = (
  failureCount: number,
  error: unknown,
) => {
  if (
    isAxiosError(error) &&
    (error.response?.status === 401 ||
      error.response?.status === 403)
  ) {
    return false;
  }

  return failureCount < 2;
};

// Query keys
export const HodStudentsKey = ["hod-students"] as const;

export const CoordinatorAssignmentsKey = [
  "coordinator-assignments",
] as const;

// Fetch all students
export const useHodStudents = () => {
  return useQuery({
    queryKey: HodStudentsKey,
    queryFn: () => getHodStudents(),
    retry: retryUnlessAuthError,
  });
};

// Fetch coordinator assignments
export const useCoordinatorAssignments = () => {
  return useQuery({
    queryKey: CoordinatorAssignmentsKey,
    queryFn: getCoordinatorAssignments,
    retry: retryUnlessAuthError,
  });
};

// Appoint a student as a coordinator
export const useCreateCoordinator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCoordinatorInput) =>
      createCoordinator(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: CoordinatorAssignmentsKey,
      });
    },
  });
};

export const useCoordinatorStatusQuery =()=>{
    return useQuery({
        queryKey:["coordinator","status"],
        queryFn:getCoordinatorStatus
    })
}
```


# FILE: apps\web\features\coordinator\api\coordinators.ts
```

import { api } from "@/lib/axios";

export type CoordinatorAssignment = {
  id: number;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  clubId: number;
  clubName: string;
  appointedBy: string;
  createdAt: string | Date;
};

export type CreateCoordinatorInput = {
  studentId: number;
  clubId: number;
};

export type UpdateCoordinatorInput = {
  studentId: number;
  clubId: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type StudentCoordinatorAssignment = {
  id: number;
  studentId: number;
  clubId: number;
  appointedBy: string;
  createdAt: string;
};

export type CoordinatorStatus = {
  isCoordinator: boolean;
  assignments: StudentCoordinatorAssignment[];
};

// Get existing coordinator assignments
export const getCoordinatorAssignments = async () => {
  const { data } = await api.get<ApiResponse<CoordinatorAssignment[]>>(
    "/hod/coordinators",
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to fetch coordinator assignments.",
    );
  }

  return data.data;
};

// Appoint a student as a club coordinator
export const createCoordinator = async (
  input: CreateCoordinatorInput,
) => {
  const { data } = await api.post<ApiResponse<CoordinatorAssignment>>(
    "/hod/coordinators",
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to appoint coordinator.");
  }

  return data.data;
};

// Update a coordinator assignment
export const updateCoordinator = async (
  assignmentId: number,
  input: UpdateCoordinatorInput,
) => {
  const { data } = await api.patch<ApiResponse<CoordinatorAssignment>>(
    `/hod/coordinators/${assignmentId}`,
    input,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update coordinator.");
  }

  return data.data;
};

// Deactivate a coordinator assignment
export const deactivateCoordinator = async (
  assignmentId: number,
) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/hod/coordinators/${assignmentId}`,
  );

  if (!data.success) {
    throw new Error(
      data.message || "Failed to deactivate coordinator assignment.",
    );
  }

  return data.data;
};

// Get coordinator status for the logged-in student
export const getCoordinatorStatus =
  async (): Promise<CoordinatorStatus> => {
    const { data } = await api.get<ApiResponse<CoordinatorStatus>>(
      "/coordinator/",
    );

    if (!data.success) {
      throw new Error(
        data.message || "Failed to fetch coordinator status.",
      );
    }

    return data.data;
  };
```


# FILE: apps\web\features\coordinator\components\coordinator-layout.tsx
```

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { name: "Dashboard", href: "/club-coordinator/dashboard", icon: "â–¦" },
  { name: "Browse Events", href: "/club-coordinator/events", icon: "â—·" },
  { name: "Request for Event", href: "/club-coordinator/request-event", icon: "+" },
  { name: "Profile", href: "/club-coordinator/profile", icon: "â™™" },
];

export default function CoordinatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const currentPage =
    navigation.find((item) => item.href === pathname)?.name ?? "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
      <aside className="flex w-full flex-col border-b border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              EduNex
            </h1>
            <p className="text-xs text-slate-500">Campus Management</p>
          </div>
        </div>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center text-lg">
                    {item.icon}
                  </span>
                  {item.name}
                  {active && (
                    <span className="ml-auto hidden h-2 w-2 rounded-full bg-indigo-600 md:block" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden p-4 md:block">
          <div className="rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm font-semibold text-indigo-900">
              Campus activities
            </p>
            <p className="mt-1 text-xs leading-5 text-indigo-700">
              Manage events and keep your campus community connected.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            EduNex Â© 2026
          </p>
        </div>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs text-slate-500">Club Coordinator / {currentPage}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {currentPage}
            </h2>
          </div>

          <Link
            href="/club-coordinator/profile"
            className="flex items-center gap-3 rounded-xl p-1 hover:bg-slate-50"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Alex Johnson
              </p>
              <p className="text-xs text-slate-500">Club Coordinator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              AJ
            </div>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```


# FILE: apps\web\features\departments\api\department-query.ts
```
import { getDepartment } from "@/features/departments/api/department"
import { useQuery } from "@tanstack/react-query"


export const DepartmentKey=["departments"] as const

export const useDepartment=(enabled = true)=>{
    return useQuery({
        queryKey:DepartmentKey,
        queryFn:getDepartment,
        enabled,
        retry:1
    })
}
```


# FILE: apps\web\features\departments\api\department.ts
```
import axios from "axios";
import { api } from "../../../lib/axios";

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export const getDepartment = async (): Promise<Department[]> => {
  try {

  const response = await api.get("/department");

    const result = response.data;

    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result?.data)) {
      return result.data;
    }

    throw new Error("Invalid departments API response");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Request URL:", error.config?.baseURL, error.config?.url);
       console.error("Request URL:", error.config?.baseURL, error.config?.url);
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    }
    throw error;
  }
};
```


# FILE: apps\web\features\events\api\event-query.ts
```
"use client";

import { getAllEvents, getMyEvents } from "@/features/events/api/event";
import { useQuery } from "@tanstack/react-query";
// import { getAllEvents, getMyEvents } from "@/lib/events";

export const useAllEventsQuery = () => {
  return useQuery({
    queryKey: ["events", "all"],
    queryFn: getAllEvents,
  });
};

export const useMyEventsQuery = () => {
  return useQuery({
    queryKey: ["events", "my"],
    queryFn: getMyEvents,
  });
};
```


# FILE: apps\web\features\events\api\event.ts
```
// import api from "@/lib/axios";

import { api } from "../../../lib/axios";

export interface Event {
  id: number;
  clubId: number;
  clubName: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<ApiResponse<Event[]>>("/events/");
  return response.data.data;
};

export const getMyEvents = async (): Promise<Event[]> => {
  const response = await api.get<ApiResponse<Event[]>>("/events/my");
  return response.data.data;
};
```


# FILE: apps\web\features\hod\api\hod-event-approvals-query.ts
```
import {
  getPendingEvents,
  reviewEvent,
} from "@/features/hod/api/hod-event-approvals";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useHodPendingEvents = () => {
  return useQuery({
    queryKey: ["hod", "event-approvals", "pending"],
    queryFn: getPendingEvents,
    retry: false,
  });
};

export const useReviewHodEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      decision,
      comments,
    }: {
      eventId: number;
      decision: "approved" | "rejected";
      comments?: string;
    }) =>
      reviewEvent(eventId, {
        decision,
        comments,
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["hod", "event-approvals", "pending"],
      });
    },

    retry: false,
  });
};
```


# FILE: apps\web\features\hod\api\hod-event-approvals.ts
```

import { api } from "../../../lib/axios";

export type PendingEvent = {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: string;
  clubId: number;
  clubName: string;
};

export type ReviewDecision = "approved" | "rejected";

export type ReviewEventData = {
  decision: ReviewDecision;
  comments?: string;
};

export async function getPendingEvents(): Promise<PendingEvent[]> {
  const response = await api.get("/hod/events/pending");

  return response.data.data ?? [];
}

export async function reviewEvent(
  eventId: number,
  data: ReviewEventData,
) {
  const response = await api.patch(
    `/hod/events/${eventId}/review`,
    data,
  );

  return response.data;
}
```


# FILE: apps\web\features\hod\api\hod-query.ts
```
import {
  getHodDashboard,
  getHodStudents,
} from "@/features/hod/api/hod";
import { useQuery } from "@tanstack/react-query";

export const useHodDashboard = () => {
  return useQuery({
    queryKey: ["hod", "dashboard"],
    queryFn: getHodDashboard,
    retry: false,
  });
};

export const useHodStudents = (
  departmentId?: number,
  semester?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "hod",
      "students",
      departmentId ?? "all",
      semester ?? "all",
    ],
    queryFn: () => getHodStudents(departmentId, semester),
    enabled,
    retry: false,
  });
};
```


# FILE: apps\web\features\hod\api\hod.ts
```
import { api } from "@/lib/axios";

export interface HodDashboard {
  staffId: number | string;
  employeeId: string;
  role: "hod";
  departmentId: number | string | null;
  designation: string | null;

  totalStudents: number;
  totalStaff: number;
  totalCoordinators: number;
  pendingApprovals: number;
}

export interface HodDashboardResponse {
  success: boolean;
  message?: string;
  data: HodDashboard;
}

export interface HodStudent {
  id: number;
  name: string;
  admissionNumber: string;
  departmentId: number;
  departmentName: string;
  departmentCode?: string;
  semester: number;
  phone: string | null;
  userId: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getHodDashboard = async (): Promise<HodDashboard> => {
  const response = await api.get<HodDashboardResponse>(
    "/hod/dashboard",
  );

  return response.data.data;
};

export const getHodStudents = async (
  departmentId?: number,
  semester?: number,
): Promise<HodStudent[]> => {
  const response = await api.get<ApiResponse<HodStudent[]>>(
    "/hod/students",
    {
      params: {
        ...(departmentId !== undefined && { departmentId }),
        ...(semester !== undefined && { semester }),
      },
    },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || "Failed to fetch students.",
    );
  }

  return response.data.data;
};
```


# FILE: apps\web\features\hod\components\event-approval-card.tsx
```
"use client";

import { useForm } from "react-hook-form";
import type { PendingEvent } from "@/features/hod/api/hod-event-approvals";

type ReviewFormData = {
  comments: string;
};

type EventApprovalCardProps = {
  event: PendingEvent;
  processing: boolean;
  onReview: (
    eventId: number,
    decision: "approved" | "rejected",
    comments?: string,
  ) => Promise<void>;
};

export default function EventApprovalCard({
  event,
  processing,
  onReview,
}: EventApprovalCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      comments: "",
    },
  });

  const submitReview = async (
    decision: "approved" | "rejected",
    formData: ReviewFormData,
  ) => {
    await onReview(
      event.id,
      decision,
      formData.comments.trim() || undefined,
    );
  };

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{event.title}</h2>

          <p className="mt-1 text-sm font-medium text-primary">
            {event.clubName}
          </p>
        </div>

        <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent">
          Pending review
        </span>
      </div>

      {event.description && (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-muted">
          {event.description}
        </p>
      )}

      <div className="mt-5 grid gap-4 rounded-xl bg-secondary p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-text-muted">Location</p>
          <p className="mt-1 font-medium">
            {event.location || "Not specified"}
          </p>
        </div>

        <div>
          <p className="text-text-muted">Club ID</p>
          <p className="mt-1 font-medium">{event.clubId}</p>
        </div>

        <div>
          <p className="text-text-muted">Start date and time</p>
          <p className="mt-1 font-medium">
            {new Date(event.startTime).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-text-muted">End date and time</p>
          <p className="mt-1 font-medium">
            {new Date(event.endTime).toLocaleString()}
          </p>
        </div>
      </div>

      <form className="mt-5 space-y-4">
        <div>
          <label
            htmlFor={`comments-${event.id}`}
            className="mb-2 block text-sm font-semibold"
          >
            Review comments
            <span className="ml-1 font-normal text-text-muted">
              (optional)
            </span>
          </label>

          <textarea
            id={`comments-${event.id}`}
            rows={3}
            placeholder="Add feedback for the club..."
            aria-invalid={Boolean(errors.comments)}
            {...register("comments", {
              maxLength: {
                value: 1000,
                message: "Comments cannot exceed 1000 characters.",
              },
            })}
            className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {errors.comments && (
            <p className="mt-1 text-sm text-red-600">
              {errors.comments.message}
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={processing}
            onClick={handleSubmit((data) =>
              submitReview("rejected", data),
            )}
            className="rounded-xl border border-red-500 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Processing..." : "Reject event"}
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={handleSubmit((data) =>
              submitReview("approved", data),
            )}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "Processing..." : "Approve event"}
          </button>
        </div>
      </form>
    </article>
  );
}
```


# FILE: apps\web\features\principal\api\principal.ts
```

import { api } from "../../../lib/axios";

export const getPrincipalDashboard = async () => {
  const response = await api.get("/principal/dashboard");
  return response.data;
};

export const getPrincipalDepartments = async () => {
  const response = await api.get("/principal/departments");
  return response.data;
};

export interface CreateHodInput {
  name: string;
  email: string;
  password: string;
  employeeId: string;
  departmentId: string;
  designation: string;
  phone?: string;
}

export const createHod = async (data: CreateHodInput) => {
  const response = await api.post("/principal/hods", data);
  return response.data;
};
```


# FILE: apps\web\features\principal\api\roles.ts
```

import { api } from "@/lib/axios";

// One role in the roles list
export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  totalAssigned: number;
}

// Permission inside a resource group
export interface Permission {
  id: number;
  action: string;
  description: string | null;
}

// Permissions grouped by resource
export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

// Single role details
export interface RoleDetail extends Role {
  permissionIds: number[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Fetch all roles
export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  const response = await api.get("/roles");
  return response.data;
};

// Fetch one role
export const getRole = async (
  id: number,
): Promise<ApiResponse<RoleDetail>> => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

// Fetch available permissions
export const getPermissionCatalog = async (): Promise<
  ApiResponse<PermissionGroup[]>
> => {
  const response = await api.get("/roles/permissions");
  return response.data;
};

// Create a new role
export interface CreateRoleInput {
  name: string;
  description?: string;
  permissionIds: number[];
}

export const createRole = async (
  data: CreateRoleInput,
): Promise<ApiResponse<Role>> => {
  const response = await api.post("/roles", data);
  return response.data;
};

// Update an existing role
export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissionIds?: number[];
}

export const updateRole = async (
  id: number,
  data: UpdateRoleInput,
): Promise<ApiResponse<{ id: number }>> => {
  const response = await api.patch(`/roles/${id}`, data);
  return response.data;
};

// Delete a role
export const deleteRole = async (
  id: number,
): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};
```


# FILE: apps\web\features\principal\components\add-hod-form.tsx
```

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addHodSchema,
  type AddHodFormData,
} from "@/features/principal/validation/add-hod-schema";

import {
  getPrincipalDepartments,
  createHod,
} from "@/features/principal/api/principal";

type Department = {
  id: number;
  name: string;
  code: string;
};

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

function extractDepartments(result: unknown): Department[] {
  if (Array.isArray(result)) {
    return result;
  }

  if (!result || typeof result !== "object") {
    throw new Error("Invalid departments API response.");
  }

  const response = result as ApiResponse<unknown>;

  if (response.success === false) {
    throw new Error(
      response.message || "Failed to load departments."
    );
  }

 
  if (Array.isArray(response.data)) {
    return response.data as Department[];
  }

  if (
    response.data &&
    typeof response.data === "object" &&
    Array.isArray(
      (response.data as { data?: unknown }).data
    )
  ) {
    return (response.data as { data: Department[] }).data;
  }

  throw new Error(
    "Departments response does not contain a department array. Check the API response."
  );
}

export default function AddHodForm() {
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    error: departmentError,
  } = useQuery<Department[]>({
    queryKey: ["principal", "departments", "add-hod-form"],
    queryFn: async () => {
      const result = await getPrincipalDepartments();
      return extractDepartments(result);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddHodFormData>({
    resolver: zodResolver(addHodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      employeeId: "",
      departmentId: "",
      designation: "Head of Department",
      phone: "",
    },
  });

  const createHodMutation = useMutation({
    mutationFn: createHod,
    onSuccess: () => {
      setSuccessMessage("HOD account created successfully!");
      reset();
    },
    onError: () => {
      setSuccessMessage("");
    },
  });

  const onSubmit = (data: AddHodFormData) => {
    setSuccessMessage("");
    createHodMutation.mutate(data);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-xl font-bold">Create HOD Account</h2>

      <p className="mt-2 text-sm text-text-muted">
        Create a Head of Department account and assign a department.
      </p>

      {successMessage && (
        <p className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-800">
          {successMessage}
        </p>
      )}

      {departmentError && (
        <p className="mt-4 text-sm text-red-600">
          {departmentError instanceof Error
            ? departmentError.message
            : "Failed to load departments."}
        </p>
      )}

      {createHodMutation.isError && (
        <p className="mt-4 text-sm text-red-600">
          {createHodMutation.error instanceof Error
            ? createHodMutation.error.message
            : "Failed to create HOD account."}
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Full Name
          </label>
          <input
            {...register("name")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Initial Password
          </label>
          <input
            type="password"
            {...register("password")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter initial password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Employee ID
          </label>
          <input
            {...register("employeeId")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter employee ID"
          />
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employeeId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Department
          </label>

          <select
            {...register("departmentId")}
            disabled={
              isLoadingDepartments || departments.length === 0
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="">
              {isLoadingDepartments
                ? "Loading departments..."
                : departments.length === 0
                  ? "No departments available"
                  : "Select department"}
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={String(department.id)}
              >
                {department.name} ({department.code})
              </option>
            ))}
          </select>

          {errors.departmentId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.departmentId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Designation
          </label>
          <input
            {...register("designation")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Head of Department"
          />
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Phone
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={
              createHodMutation.isPending ||
              departments.length === 0
            }
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createHodMutation.isPending
              ? "Creating HOD..."
              : "Create HOD"}
          </button>
        </div>
      </form>
    </section>
  );
}
```


# FILE: apps\web\features\principal\validation\add-hod-schema.ts
```
import { z } from "zod";

export const addHodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  employeeId: z.string().trim().min(1, "Employee ID is required"),
  departmentId: z.string().min(1, "Please select a department"),
  designation: z.string().trim().min(1, "Designation is required"),
  phone: z.string().optional(),
});

export type AddHodFormData = z.infer<typeof addHodSchema>;
```


# FILE: apps\web\features\students\api\student-query.ts
```
import { CreateStudentProfile,getStudentProfile, type StudentProfileInput,} from "@/features/students/api/student";
import {useMutation, useQuery, useQueryClient,} from "@tanstack/react-query";

export const StudentProfileKey = ["student-profile"] as const;


export const useStudentProfile = () => {
  return useQuery({
    queryKey: StudentProfileKey,
    queryFn: getStudentProfile,

    retry: (failureCount, error: any) => {
      const status = error.response?.status;
      if (status === 401 || status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });
};

export const useCreateStudentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StudentProfileInput) =>
      CreateStudentProfile(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: StudentProfileKey,
      });
    },
  });
};
```


# FILE: apps\web\features\students\api\student.ts
```


import { api } from "../../../lib/axios";

export interface StudentProfileInput {
  admissionNumber: string;
  departmentId: string;   // âœ… number â†’ string
  semester: string;       // âœ… number â†’ string
  phone?: string;
};

export interface StudentProfile {
  id: number;
  name: string;
  userId: string;
  admissionNumber: string;
  departmentId: number | null;
  semester: number | null;
  phone: string | null;
}

export const getStudentProfile = async () => {
  const { data } = await api.get("/students/profile");
  return data;
};

export const CreateStudentProfile = async (
  input: StudentProfileInput
) => {
const { data } = await api.post("/students/profile", input);
  return data;
};
```


# FILE: apps\web\features\students\validation\student-profile-schema.ts
```
import { isPossiblePhoneNumber } from "react-phone-number-input";
import z from "zod";


export const studentProfileSchema =z.object({
    admissionNumber:z
    .string().trim()
    .min(1, "Admission number is required.")
    .max(30, "Admission number must be at most 30 characters.")
    .regex(/^[a-zA-Z0-9/-]+$/,"Use only letters, numbers, hyphens, and slashes."),

    departmentId:z
    .string().min(1, "Please select a department.")
    .regex(/^[1-9]\d*$/, "Please select a valid department."),

    semester: z
        .string()
        .min(1, "Please select your semester")
        .regex(/^[1-9]\d*$/, "Please select a valid semester")
        .refine(
          (value) => Number(value) <= 8,
          "Semester must be between 1 and 8"
        ),

    phone: z
    .string()
    .refine(
      (value) => isPossiblePhoneNumber(value),
      "Enter a valid international phone number."),

})


export type StudentProfileFormValues=z.infer<typeof studentProfileSchema >
```


# FILE: apps\web\lib\auth-client.ts
```

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5000/api/auth",
});
```


# FILE: apps\web\lib\axios.ts
```
import axios from "axios";

export const api=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true,
    headers:{
        "Content-Type": "application/json",
    }
})
```


# FILE: apps\web\lib\navigation\access.ts
```

import { isAxiosError } from "axios";

import { useCurrentUser } from "@/features/auth/api/auth-query";
import { useModeStore } from "@/stores/mode-store";
import { NAV, isNavVisible } from "./nav";

// Everything the UI needs to decide what to show.
export function useAccess() {
  const {
    data: me,
    isPending,
    isError,
    error,
    refetch,
  } = useCurrentUser();

  const storedMode = useModeStore((s) => s.mode);
  const setMode = useModeStore((s) => s.setMode);

  const roleSlugs = me?.roles.map((r) => r.slug) ?? [];

  const hasRole = (slug: string) => roleSlugs.includes(slug);
  const hasAnyRole = (slugs: string[]) => slugs.some(hasRole);

  const can = (resource: string, action: string) =>
    !!me?.permissions.includes(`${resource}:${action}`);

  // The switch exists only for students who are also club coordinators.
  const canSwitchMode =
    hasRole("student") && hasRole("club-coordinator");

  const mode = canSwitchMode ? storedMode : "student";

  const navItems = NAV.filter((item) =>
    isNavVisible(item, { mode, hasAnyRole, can }),
  );

  return {
    me,
    isPending,
    isError,
    error,
    refetch,
    unauthorized:
      isError && isAxiosError(error) && error.response?.status === 401,
    roleSlugs,
    hasRole,
    hasAnyRole,
    can,
    canSwitchMode,
    mode,
    setMode,
    navItems,
  };
}
```


# FILE: apps\web\lib\navigation\nav.ts
```
import type { Mode } from "@/stores/mode-store";

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  description?: string;
  /** Needs this permission: [resource, action]. */
  permission?: [string, string];
  /** Needs at least one of these role slugs. */
  roles?: string[];
  /** Only shown in this mode (student / coordinator view). */
  mode?: Mode;
};

const ADMIN = ["super-admin"];
const HOD = ["hod", "super-admin"];

// ONE place that decides who sees what. Adjust hrefs to your real pages.
export const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "âŒ‚" },

  // Administration
  { label: "Staff Management", href: "/principal/staff", icon: "â™™", roles: ADMIN, permission: ["staff", "create"], description: "Add HODs, manage staff accounts and assignments." },
  { label: "Departments", href: "/principal/departments", icon: "â–¦", roles: ADMIN, permission: ["department", "view"], description: "View college departments and their details." },
  { label: "College Students", href: "/principal/students", icon: "â™§", roles: ADMIN, permission: ["student", "view"], description: "Browse students by department and semester." },
  { label: "College Events", href: "/principal/events", icon: "â–£", roles: ADMIN, permission: ["event", "view"], description: "View college-wide event information." },
  {
  label: "Roles & Permissions",
  href: "/principal/roles",
  icon: "âš™",
  roles: ADMIN,
  permission: ["role", "view"],
  description: "Manage roles and their permissions.",
},

  // Head of Department
  { label: "Department Overview", href: "/hod", icon: "âŒ‚", roles: HOD, permission: ["staff", "view"], description: "Your department at a glance." },
  { label: "Students", href: "/hod/students", icon: "â™§", roles: HOD, permission: ["student", "view"], description: "Students in your department." },
  { label: "Clubs", href: "/hod/clubs", icon: "â—ˆ", roles: HOD, permission: ["club", "view"], description: "Clubs in your department." },
  { label: "Coordinators", href: "/hod/coordinators", icon: "â˜…", roles: HOD, permission: ["coordinator", "view"], description: "Appoint and manage club coordinators." },
  { label: "Event Approvals", href: "/hod/event-approvals", icon: "âœ“", roles: HOD, permission: ["event", "approve"], description: "Review events waiting for approval." },

  // Student view
  { label: "My Profile", href: "/student", icon: "â˜º", roles: ["student"], mode: "student", description: "Your student profile and details." },
  { label: "Events", href: "/student/events", icon: "â–£", roles: ["student"], permission: ["event", "view"], mode: "student", description: "Browse college events." },

  // Coordinator view
  { label: "My Club Events", href: "/club-coordinator", icon: "â–£", roles: ["club-coordinator"], permission: ["event", "view"], mode: "coordinator", description: "Create and manage events for your clubs." },
];

export const isNavVisible = (
  item: NavItem,
  ctx: {
    mode: Mode;
    hasAnyRole: (slugs: string[]) => boolean;
    can: (resource: string, action: string) => boolean;
  },
) =>
  (!item.roles || ctx.hasAnyRole(item.roles)) &&
  (!item.permission || ctx.can(item.permission[0], item.permission[1])) &&
  (!item.mode || item.mode === ctx.mode);
```


# FILE: apps\web\stores\mode-store.ts
```
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "student" | "coordinator";

// Frontend-only view mode. The backend always checks the union of roles.
export const useModeStore = create<{
  mode: Mode;
  setMode: (mode: Mode) => void;
}>()(
  persist(
    (set) => ({
      mode: "student",
      setMode: (mode) => set({ mode }),
    }),
    { name: "edunex-mode" },
  ),
);
```
