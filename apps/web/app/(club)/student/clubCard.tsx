import Link from "next/link";
import type { Club } from "@/lib/clubs";
import Card from "@/app/ui/card";
import Button from "@/app/ui/button";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="group flex h-full flex-col transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-xl font-bold text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        ✦
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
            <span aria-hidden="true">→</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}