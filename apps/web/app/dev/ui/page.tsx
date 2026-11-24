import { notFound } from "next/navigation";

import UiShowcase from "@/components/showcase/ui-showcase";

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <UiShowcase />;
}
