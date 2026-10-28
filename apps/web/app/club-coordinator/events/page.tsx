
"use client";

import { useMemo, useState } from "react";
import CoordinatorLayout from "@/components/club-coordinator/CoordinatorLayout";

const events = [
  { id: 1, name: "TechFest 2026", category: "Technology", date: "Oct 28, 2026", venue: "Main Auditorium", description: "A campus-wide technology festival featuring coding challenges, innovation showcases and workshops.", status: "Approved", color: "from-blue-500 to-indigo-600" },
  { id: 2, name: "Cultural Fusion", category: "Cultural", date: "Nov 02, 2026", venue: "Open Air Theatre", description: "Celebrate campus culture through music, dance, performances and creative activities.", status: "Approved", color: "from-pink-500 to-rose-600" },
  { id: 3, name: "Campus Football Cup", category: "Sports", date: "Nov 08, 2026", venue: "College Ground", description: "Bring teams together for an exciting inter-department football tournament.", status: "Pending", color: "from-emerald-500 to-teal-600" },
  { id: 4, name: "Design Thinking Workshop", category: "Workshop", date: "Nov 12, 2026", venue: "Seminar Hall", description: "Explore creative problem-solving and collaborative product design techniques.", status: "Approved", color: "from-amber-500 to-orange-600" },
  { id: 5, name: "Photography Walk", category: "Cultural", date: "Nov 15, 2026", venue: "Campus Garden", description: "A guided campus photography session for beginners and enthusiasts.", status: "Approved", color: "from-violet-500 to-purple-600" },
  { id: 6, name: "Code Sprint", category: "Technology", date: "Nov 20, 2026", venue: "Computer Lab", description: "Solve practical programming problems and build small projects in teams.", status: "Pending", color: "from-cyan-500 to-blue-600" },
];

const categories = ["All", "My Events"];

export default function BrowseEventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesSearch = `${event.name} ${event.venue} ${event.description}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch && (category === "All" || event.category === category);
      }),
    [search, category]
  );

  return (
    <CoordinatorLayout>
      <div className="mb-7">
        <p className="text-sm font-medium text-indigo-600">Discover & participate</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Browse Events</h1>
        <p className="mt-2 text-sm text-slate-500">
          Explore campus activities and stay up to date with upcoming events.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, venues..."
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
        >
          {categories.map((item) => (
            <option key={item} value={item}>{item === "All" ? "All categories" : item}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredEvents.length}</span> events
        </p>
        <span className="text-xs text-slate-400">Sample campus events</span>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <article key={event.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className={`flex h-36 items-end bg-gradient-to-br ${event.color} p-5`}>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {event.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">{event.name}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    event.status === "Approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="mt-3 min-h-[60px] text-sm leading-6 text-slate-500">{event.description}</p>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <p><span className="mr-2 text-indigo-600">▦</span>{event.date}</p>
                  <p><span className="mr-2 text-indigo-600">⌖</span>{event.venue}</p>
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
                  {event.status === "Approved" ? "Event details preview" : "Awaiting approval"}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-lg font-semibold text-slate-800">No events found</p>
          <p className="mt-2 text-sm text-slate-500">Try a different search or category.</p>
          <button
            onClick={() => { setSearch(""); setCategory("All"); }}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </CoordinatorLayout>
  );
}
