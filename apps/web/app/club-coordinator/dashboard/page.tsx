
import Link from "next/link";
import CoordinatorLayout from "@/components/club-coordinator/CoordinatorLayout";

const stats = [
  { label: "Total Events", value: "24", change: "Across campus", icon: "◷", color: "bg-blue-50 text-blue-700" },
  { label: "Upcoming Events", value: "08", change: "Next 30 days", icon: "▦", color: "bg-violet-50 text-violet-700" },
  { label: "Pending Requests", value: "03", change: "Awaiting approval", icon: "◴", color: "bg-amber-50 text-amber-700" },
  { label: "Events Completed", value: "16", change: "This academic year", icon: "✓", color: "bg-emerald-50 text-emerald-700" },
];

const events = [
  { name: "TechFest 2026", category: "Technology", date: "Oct 28, 2026", venue: "Main Auditorium", status: "Approved" },
  { name: "Cultural Fusion", category: "Cultural", date: "Nov 02, 2026", venue: "Open Air Theatre", status: "Approved" },
  { name: "Campus Football Cup", category: "Sports", date: "Nov 08, 2026", venue: "College Ground", status: "Pending" },
];

const activities = [
  { title: "TechFest 2026", detail: "Event request approved", time: "Today, 10:30 AM", color: "bg-emerald-500" },
  { title: "Cultural Fusion", detail: "Venue booking confirmed", time: "Yesterday", color: "bg-indigo-500" },
  { title: "Campus Football Cup", detail: "Request submitted for review", time: "Oct 21, 2026", color: "bg-amber-500" },
];

export default function CoordinatorDashboard() {
  return (
    <CoordinatorLayout>
      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">Friday, October 23, 2026</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, Alex!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here&apos;s what&apos;s happening with your campus events.
          </p>
        </div>
        <Link
          href="/club-coordinator/request-event"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <span className="text-lg">+</span> Request an Event
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            <p className="mt-2 text-xs text-slate-500">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-slate-900">Upcoming Events</h2>
              <p className="mt-1 text-xs text-slate-500">A quick look at scheduled campus events</p>
            </div>
            <Link href="/club-coordinator/events" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
              Browse all →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Event</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Venue</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => (
                  <tr key={event.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{event.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{event.category}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{event.date}</td>
                    <td className="px-6 py-4 text-slate-600">{event.venue}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        event.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          <p className="mt-1 text-xs text-slate-500">Latest updates on your events</p>

          <div className="mt-6 space-y-6">
            {activities.map((activity) => (
              <div key={activity.title} className="flex gap-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${activity.color}`} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{activity.detail}</p>
                  <p className="mt-2 text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/club-coordinator/request-event"
            className="mt-7 flex w-full items-center justify-center rounded-xl border border-indigo-200 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            + Create an event request
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-100">Make it happen</p>
            <h2 className="mt-2 text-xl font-bold">Have an idea for your campus?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
              Submit an event proposal and help make your college community more active.
            </p>
          </div>
          <Link
            href="/club-coordinator/request-event"
            className="shrink-0 rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Submit Proposal →
          </Link>
        </div>
      </section>
    </CoordinatorLayout>
  );
}
