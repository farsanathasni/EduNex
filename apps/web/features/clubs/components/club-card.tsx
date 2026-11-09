import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Club } from "@/features/clubs/api/clubs";
import Card from "@/components/ui/card";

interface ClubCardProps {
  club: Club;
}

function getClubInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Card
      padding="lg"
      className="group relative flex h-full flex-col gap-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Identity */}
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-subheading font-extrabold tracking-wide text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
        >
          {getClubInitials(club.name)}
        </div>

        <h3 className="line-clamp-2 text-body-lg font-bold leading-snug tracking-tight text-text">
          {club.name}
        </h3>
      </div>

      {/* Description */}
      <p className="line-clamp-3 min-h-[4.5rem] flex-1 text-label leading-6 text-text-muted">
        {club.description ||
          "Explore activities, discover new interests, and connect with students on campus."}
      </p>

      {/* Footer action. The link covers the whole card (after:absolute) so the
          entire card is clickable, with a single focusable element. */}
      <div className="border-t border-border-subtle pt-4">
        <Link
          href={`/student/${club.id}`}
          className="inline-flex items-center gap-2 rounded-lg text-label font-semibold text-primary transition-colors after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-primary-hover focus-visible:outline-none"
        >
          Explore club
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </Card>
  );
}
