
// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import Button from "@/app/ui/button";
// import { useCoordinatorStatusQuery } from "@/app/club-coordinator/coordinatorquery";
// // import { useCoordinatorStatusQuery } from "@/app/(dashboard)/club-coordinator/coordinatorQuery";

// const stats = [
//   {
//     title: "Study Materials",
//     value: "24",
//     description: "Resources to explore",
//     icon: "📚",
//     href: "/student/resources",
//     color: "bg-blue-50 text-blue-700",
//   },
//   {
//     title: "Upcoming Events",
//     value: "03",
//     description: "Events to look forward to",
//     icon: "🎉",
//     href: "/student/events",
//     color: "bg-orange-50 text-orange-600",
//   },
//   {
//     title: "My Clubs",
//     value: "02",
//     description: "Your campus communities",
//     icon: "🤝",
//     href: "/student/clubs",
//     color: "bg-green-50 text-green-700",
//   },
//   {
//     title: "My Reports",
//     value: "01",
//     description: "Track your reported issues",
//     icon: "📝",
//     href: "/student/issues",
//     color: "bg-purple-50 text-purple-700",
//   },
// ];

// const events = [
//   {
//     id: 1,
//     name: "Tech Fest 2026",
//     category: "Technology",
//     date: "Oct 30",
//     time: "10:00 AM",
//     venue: "Main Auditorium",
//     description:
//       "Explore innovation, technology exhibitions, coding challenges and exciting workshops.",
//     icon: "💻",
//     color: "bg-blue-50",
//   },
//   {
//     id: 2,
//     name: "Arts & Culture Day",
//     category: "Cultural",
//     date: "Nov 02",
//     time: "11:00 AM",
//     venue: "College Ground",
//     description:
//       "Celebrate campus creativity with performances, music and cultural activities.",
//     icon: "🎭",
//     color: "bg-orange-50",
//   },
//   {
//     id: 3,
//     name: "Career Connect",
//     category: "Career",
//     date: "Nov 05",
//     time: "09:30 AM",
//     venue: "Seminar Hall",
//     description:
//       "Meet professionals, discover career opportunities and improve your interview skills.",
//     icon: "🚀",
//     color: "bg-purple-50",
//   },
// ];

// const announcements = [
//   {
//     id: 1,
//     title: "Library Resource Update",
//     message:
//       "New learning materials have been added to the student resource library.",
//     date: "Today",
//     type: "Academic",
//     icon: "📚",
//     color: "bg-blue-50 text-blue-700",
//   },
//   {
//     id: 2,
//     title: "Club Memberships",
//     message:
//       "Check your membership requests to see the latest approval status.",
//     date: "Yesterday",
//     type: "Clubs",
//     icon: "🤝",
//     color: "bg-green-50 text-green-700",
//   },
//   {
//     id: 3,
//     title: "Upcoming Campus Events",
//     message:
//       "Registration is open for upcoming student activities and events.",
//     date: "Oct 26",
//     type: "Events",
//     icon: "🎉",
//     color: "bg-orange-50 text-orange-700",
//   },
// ];

// const clubs = [
//   {
//     id: 1,
//     name: "Tech Innovators",
//     category: "Technology & Innovation",
//     members: "45+ members",
//     icon: "💻",
//     color: "from-blue-600 to-indigo-600",
//   },
//   {
//     id: 2,
//     name: "Creative Minds",
//     category: "Arts & Culture",
//     members: "32+ members",
//     icon: "🎨",
//     color: "from-orange-500 to-pink-500",
//   },
//   {
//     id: 3,
//     name: "Green Campus",
//     category: "Environment & Community",
//     members: "28+ members",
//     icon: "🌱",
//     color: "from-green-500 to-emerald-600",
//   },
// ];

// const quickActions = [
//   {
//     title: "Explore Clubs",
//     description: "Find your community",
//     icon: "🤝",
//     href: "/student/clubs",
//     color: "bg-green-50",
//   },
//   {
//     title: "Browse Events",
//     description: "Discover campus activities",
//     icon: "🎉",
//     href: "/student/events",
//     color: "bg-orange-50",
//   },
//   {
//     title: "Study Resources",
//     description: "Learn something new",
//     icon: "📖",
//     href: "/student/resources",
//     color: "bg-blue-50",
//   },
//   {
//     title: "Report an Issue",
//     description: "Let us know what happened",
//     icon: "💬",
//     href: "/student/issues",
//     color: "bg-purple-50",
//   },
// ];

// const menuItems = [
//   { label: "Overview", href: "/student/dashboard", icon: "⌂" },
//   { label: "My Profile", href: "/student/profile", icon: "👤" },
//   { label: "Clubs", href: "/student/clubs", icon: "🤝" },
//   { label: "Events", href: "/student/events", icon: "📅" },
//   { label: "Study Resources", href: "/student/resources", icon: "📚" },
//   { label: "Study Groups", href: "/student/study-groups", icon: "👥" },
//   { label: "Lost & Found", href: "/student/lost-found", icon: "🔎" },
//   { label: "Report an Issue", href: "/student/issues", icon: "📝" },
// ];

// export default function StudentDashboard() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { data: session, isPending } = authClient.useSession();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [dashboardMode,setDashboardMode]=useState<"student"|"coordinator">("student")

//   const { data: coordinatorStatus } = useCoordinatorStatusQuery();

//   const user = session?.user;
//   const firstName = user?.name?.trim().split(/\s+/)[0] || "Student";

//   const filteredEvents = events.filter((event) =>
//     `${event.name} ${event.category} ${event.venue}`
//       .toLowerCase()
//       .includes(search.toLowerCase()),
//   );

//   async function handleLogout() {
//     try {
//       await authClient.signOut();
//       router.replace("/login");
//       router.refresh();
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   }

//   if (isPending) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
//           <p className="mt-4 text-sm font-medium text-muted">
//             Preparing your campus...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-text">
//       {/* Mobile overlay */}
//       {mobileMenuOpen && (
//         <button
//           type="button"
//           aria-label="Close navigation"
//           onClick={() => setMobileMenuOpen(false)}
//           className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${
//           mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex h-[82px] items-center justify-between border-b border-border px-6">
//           <Link
//             href="/student/dashboard"
//             className="flex items-center gap-3"
//             onClick={() => setMobileMenuOpen(false)}
//           >
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-md">
//               E
//             </div>
//             <div>
//               <p className="text-xl font-extrabold tracking-tight text-primary">
//                 EduNex
//               </p>
//               <p className="text-xs text-muted">Your campus, connected.</p>
//             </div>
//           </Link>

//           <button
//             type="button"
//             onClick={() => setMobileMenuOpen(false)}
//             aria-label="Close menu"
//             className="rounded-lg p-2 text-muted hover:bg-secondary lg:hidden"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="px-5 pt-7">
//           {dashboardMode === "student"
//   ? "Student workspace"
//   : "Coordinator workspace"}

//           <nav className="space-y-1">
//             {menuItems.map((item) => {
//               const active = pathname === item.href;

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setMobileMenuOpen(false)}
//                   className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
//                     active
//                       ? "bg-primary text-white shadow-md shadow-primary/15"
//                       : "text-muted hover:bg-secondary hover:text-primary"
//                   }`}
//                 >
//                   <span className="flex h-7 w-7 items-center justify-center text-lg">
//                     {item.icon}
//                   </span>
//                   <span>{item.label}</span>
//                   {active && (
//                     <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
//                   )}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         <div className="mt-auto p-5">
//           <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#416fc2] p-5 text-white">
//             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
//               ✨
//             </div>
//             <h3 className="font-bold">Make campus life count!</h3>
//             <p className="mt-2 text-xs leading-5 text-white/80">
//               Join a club, attend an event, and discover new opportunities.
//             </p>
//             <Link
//               href="/student/clubs"
//               className="mt-4 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-primary transition hover:bg-blue-50"
//             >
//               Find your community →
//             </Link>
//           </div>

//           <div className="mt-5 flex items-center gap-3 px-1">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary">
//               {firstName.charAt(0).toUpperCase()}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="truncate text-sm font-bold">{user?.name || "Student"}</p>
//               <p className="truncate text-xs text-muted">Student account</p>
//             </div>
//             <button
//               type="button"
//               onClick={handleLogout}
//               title="Log out"
//               aria-label="Log out"
//               className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
//             >
//               ↗
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="min-h-screen lg:ml-[270px]">
//         {/* Top navigation */}
//         <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
//           <div className="flex min-h-[82px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => setMobileMenuOpen(true)}
//                 aria-label="Open navigation"
//                 className="rounded-xl border border-border p-2.5 text-primary hover:bg-secondary lg:hidden"
//               >
//                 ☰
//               </button>
//               <div>
//                 <p className="text-sm font-bold text-text">
//   {dashboardMode === "student"
//     ? "Student Dashboard"
//     : "Club Coordinator Dashboard"}
// </p>
//                 <p className="hidden text-xs text-muted sm:block">
//                   Your personal campus space
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3">
//               <label className="hidden min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 md:flex">
//                 <span className="text-muted">⌕</span>
//                 <input
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search events..."
//                   className="w-36 bg-transparent text-sm outline-none placeholder:text-subtle lg:w-48"
//                 />
//               </label>

//               {coordinatorStatus?.isCoordinator && (
//   <Button
//     onClick={() =>
//       setDashboardMode((current) =>
//         current === "student" ? "coordinator" : "student"
//       )
//     }
//   >
//     {dashboardMode === "student"
//       ? "Switch to Coordinator"
//       : "Switch to Student"}
//   </Button>
// )}

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
//               >
//                 <span className="sm:hidden">↗</span>
//                 <span className="hidden sm:inline">Log out</span>
//               </button>
//             </div>
//           </div>
//         </header>

// <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
//           {/* Welcome hero */}
//           <section className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-primary via-[#2c5bab] to-[#4777c7] px-6 py-8 text-white shadow-lg shadow-primary/10 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
//             <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-72 w-72 rounded-full border-[40px] border-white/[0.06]" />
//             <div className="pointer-events-none absolute -bottom-24 right-[22%] -z-10 h-48 w-48 rounded-full bg-white/[0.06]" />

//             <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
//               <div className="max-w-2xl">
//                 <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90">
//                   <span className="h-2 w-2 rounded-full bg-green-300" />
//                   YOUR CAMPUS JOURNEY STARTS HERE
//                 </div>

//                 <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
//                   Hey, {firstName}! 👋
//                   <br />
//                   <span className="text-blue-100">
//                     Ready to make today count?
//                   </span>
//                 </h1>

//                 <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50/90 sm:text-base">
//                   Discover new opportunities, connect with your campus
//                   community, and make every college day meaningful.
//                 </p>

//                 <div className="mt-7 flex flex-wrap gap-3">
//                   <Link
//                     href="/student/events"
//                     className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
//                   >
//                     Explore Events <span>→</span>
//                   </Link>
//                   <Link
//                     href="/student"
//                     className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
//                   >
//                     Discover Clubs
//                   </Link>
//                 </div>
//               </div>

//               <div className="hidden lg:flex">
//                 <div className="flex h-44 w-44 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm">
//                   🎓
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs text-blue-50/90">
//               <span>📚 Learn something new</span>
//               <span>🤝 Meet your community</span>
//               <span>🚀 Build your future</span>
//             </div>
//           </section>

//           {/* Overview heading */}
//           <section>
//             <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
//                   Your overview
//                 </p>
//                 <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
//                   Your campus at a glance
//                 </h2>
//                 <p className="mt-1 text-sm text-muted">
//                   Everything you need for a productive campus life.
//                 </p>
//               </div>
//               <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
//                 Student workspace
//               </span>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//               {stats.map((stat) => (
//                 <Link
//                   href={stat.href}
//                   key={stat.title}
//                   className="group rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${stat.color}`}>
//                       {stat.icon}
//                     </div>
//                     <span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">
//                       →
//                     </span>
//                   </div>
//                   <p className="mt-5 text-sm font-medium text-muted">
//                     {stat.title}
//                   </p>
//                   <div className="mt-1 flex items-end justify-between gap-2">
//                     <span className="text-3xl font-extrabold tracking-tight">
//                       {stat.value}
//                     </span>
//                   </div>
//                   <p className="mt-2 text-xs text-subtle">
//                     {stat.description}
//                   </p>
//                 </Link>
//               ))}
//             </div>
//           </section>

//           {/* Events and announcements */}
//           <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
//             {/* Events */}
//             <div className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6">
//               <div className="mb-6 flex items-start justify-between gap-3">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
//                     Don't miss out
//                   </p>
//                   <h2 className="mt-1 text-xl font-extrabold">
//                     Upcoming Events
//                   </h2>
//                   <p className="mt-1 text-sm text-muted">
//                     What's happening around your campus.
//                   </p>
//                 </div>
//                 <Link
//                   href="/student/events"
//                   className="shrink-0 rounded-lg px-2 py-2 text-sm font-bold text-primary hover:bg-primary-subtle"
//                 >
//                   View all →
//                 </Link>
//               </div>

//               <div className="mb-4 md:hidden">
//                 <input
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder="Search events..."
//                   className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
//                 />
//               </div>

//               <div className="space-y-4">
//                 {filteredEvents.length > 0 ? (
//                   filteredEvents.map((event) => (
//                     <article
//                       key={event.id}
//                       className="group flex gap-4 rounded-2xl border border-border-subtle p-4 transition hover:border-primary/30 hover:bg-primary/[0.02]"
//                     >
//                       <div className="flex w-[68px] shrink-0 flex-col items-center justify-center self-start rounded-xl bg-primary-subtle px-2 py-3 text-center">
//                         <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
//                           {event.date.split(" ")[0]}
//                         </span>
//                         <span className="mt-0.5 text-2xl font-extrabold text-primary">
//                           {event.date.split(" ")[1]}
//                         </span>
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <div className="flex flex-wrap items-center gap-2">
//                           <h3 className="font-bold text-text transition group-hover:text-primary">
//                             {event.name}
//                           </h3>
//                           <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted">
//                             {event.category}
//                           </span>
//                         </div>
//                         <p className="mt-2 text-sm leading-6 text-muted">
//                           {event.description}
//                         </p>
//                         <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-subtle">
//                           <span>◷ {event.time}</span>
//                           <span>⌖ {event.venue}</span>
//                         </div>
//                       </div>

//                       <span className="hidden text-2xl sm:block">
//                         {event.icon}
//                       </span>
//                     </article>
//                   ))
//                 ) : (
//                   <div className="rounded-xl border border-dashed border-border p-8 text-center">
//                     <p className="text-2xl">🔎</p>
//                     <p className="mt-2 font-semibold">No events found</p>
//                     <p className="mt-1 text-sm text-muted">
//                       Try searching with a different keyword.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Announcements */}
//             <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
//               <div className="mb-6 flex items-start justify-between gap-3">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">
//                     Stay informed
//                   </p>
//                   <h2 className="mt-1 text-xl font-extrabold">
//                     Campus Updates
//                   </h2>
//                   <p className="mt-1 text-sm text-muted">
//                     The latest news and announcements.
//                   </p>
//                 </div>
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-xl">
//                   📢
//                 </div>
//               </div>

//               <div className="space-y-5">
//                 {announcements.map((announcement, index) => (
//                   <article key={announcement.id} className="flex gap-3">
//                     <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${announcement.color}`}>
//                       {announcement.icon}
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <div className="flex flex-wrap items-center justify-between gap-2">
//                         <h3 className="text-sm font-bold">
//                           {announcement.title}
//                         </h3>
//                         <span className="text-[10px] text-subtle">
//                           {announcement.date}
//                         </span>
//                       </div>
//                       <p className="mt-1 text-xs leading-5 text-muted">
//                         {announcement.message}
//                       </p>
//                       <span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted">
//                         {announcement.type}
//                       </span>
//                     </div>
//                     {index < announcements.length - 1 && null}
//                   </article>
//                 ))}
//               </div>

//               <Link
//                 href="/student/announcements"
//                 className="mt-6 flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-primary-subtle"
//               >
//                 View all announcements →
//               </Link>
//             </div>
//           </section>

//           {/* Student clubs */}
//           <section>
//             <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">
//                   Find your people
//                 </p>
//                 <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
//                   Discover Campus Clubs
//                 </h2>
//                 <p className="mt-1 text-sm text-muted">
//                   Meet people who share your interests.
//                 </p>
//               </div>
//               <Link
//                 href="/student/clubs"
//                 className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary-subtle"
//               >
//                 Explore all clubs →
//               </Link>
//             </div>

//             <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {clubs.map((club) => (
//                 <article
//                   key={club.id}
//                   className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
//                 >
//                   <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${club.color}`}>
//                     <span className="text-5xl transition duration-300 group-hover:scale-110">
//                       {club.icon}
//                     </span>
//                   </div>

//                   <div className="p-5">
//                     <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
//                       {club.category}
//                     </span>
//                     <h3 className="mt-3 text-lg font-extrabold">
//                       {club.name}
//                     </h3>
//                     <p className="mt-1 text-sm text-muted">{club.members}</p>

//                     <Link
//                       href="/student/clubs"
//                       className="mt-5 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary-subtle"
//                     >
//                       View club details <span>→</span>
//                     </Link>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </section>

//           {/* Quick actions */}
//           <section>
//             <div className="mb-5">
//               <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
//                 Get things done
//               </p>
//               <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
//                 Quick Actions
//               </h2>
//               <p className="mt-1 text-sm text-muted">
//                 Jump straight to what you need.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//               {quickActions.map((action) => (
//                 <Link
//                   key={action.title}
//                   href={action.href}
//                   className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
//                 >
//                   <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-105 ${action.color}`}>
//                     {action.icon}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="font-bold transition group-hover:text-primary">
//                       {action.title}
//                     </h3>
//                     <p className="mt-1 text-xs leading-5 text-muted">
//                       {action.description}
//                     </p>
//                   </div>
//                   <span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">
//                     →
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           </section>

//           {/* Footer */}
//           <footer className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-xs text-subtle sm:flex-row sm:text-left">
//             <p>
//               © {new Date().getFullYear()} EduNex. Built for a better campus
//               experience.
//             </p>
//             <div className="flex items-center gap-4">
//               <Link
//                 href="/student/profile"
//                 className="transition hover:text-primary"
//               >
//                 My Profile
//               </Link>
//               <Link
//                 href="/student/issues"
//                 className="transition hover:text-primary"
//               >
//                 Help & Support
//               </Link>
//             </div>
//           </footer>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useCoordinatorStatusQuery } from "@/app/club-coordinator/coordinatorquery";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { useState } from "react";


type DashboardMode = "student" | "coordinator";

const studentStats = [
  { title: "Study Materials", value: "24", description: "Resources to explore", icon: "📚", href: "/student/resources", color: "bg-blue-50 text-blue-700" },
  { title: "Upcoming Events", value: "03", description: "Events to look forward to", icon: "🎉", href: "/student/events", color: "bg-orange-50 text-orange-600" },
  { title: "My Clubs", value: "02", description: "Your campus communities", icon: "🤝", href: "/student/clubs", color: "bg-green-50 text-green-700" },
  { title: "My Reports", value: "01", description: "Track your reported issues", icon: "📝", href: "/student/issues", color: "bg-purple-50 text-purple-700" },
];

const studentEvents = [
  { id: 1, name: "Tech Fest 2026", category: "Technology", date: "Oct 30", time: "10:00 AM", venue: "Main Auditorium", description: "Explore innovation, technology exhibitions, coding challenges and exciting workshops.", icon: "💻" },
  { id: 2, name: "Arts & Culture Day", category: "Cultural", date: "Nov 02", time: "11:00 AM", venue: "College Ground", description: "Celebrate campus creativity with performances, music and cultural activities.", icon: "🎭" },
  { id: 3, name: "Career Connect", category: "Career", date: "Nov 05", time: "09:30 AM", venue: "Seminar Hall", description: "Meet professionals, discover career opportunities and improve your interview skills.", icon: "🚀" },
];

const announcements = [
  { id: 1, title: "Library Resource Update", message: "New learning materials have been added to the student resource library.", date: "Today", type: "Academic", icon: "📚", color: "bg-blue-50 text-blue-700" },
  { id: 2, title: "Club Memberships", message: "Check your membership requests to see the latest approval status.", date: "Yesterday", type: "Clubs", icon: "🤝", color: "bg-green-50 text-green-700" },
  { id: 3, title: "Upcoming Campus Events", message: "Registration is open for upcoming student activities and events.", date: "Oct 26", type: "Events", icon: "🎉", color: "bg-orange-50 text-orange-700" },
];

const clubs = [
  { id: 1, name: "Tech Innovators", category: "Technology & Innovation", members: "45+ members", icon: "💻", color: "from-blue-600 to-indigo-600" },
  { id: 2, name: "Creative Minds", category: "Arts & Culture", members: "32+ members", icon: "🎨", color: "from-orange-500 to-pink-500" },
  { id: 3, name: "Green Campus", category: "Environment & Community", members: "28+ members", icon: "🌱", color: "from-green-500 to-emerald-600" },
];

const studentQuickActions = [
  { title: "Explore Clubs", description: "Find your community", icon: "🤝", href: "/student/clubs", color: "bg-green-50" },
  { title: "Browse Events", description: "Discover campus activities", icon: "🎉", href: "/student/events", color: "bg-orange-50" },
  { title: "Study Resources", description: "Learn something new", icon: "📖", href: "/student/resources", color: "bg-blue-50" },
  { title: "Report an Issue", description: "Let us know what happened", icon: "💬", href: "/student/issues", color: "bg-purple-50" },
];

const coordinatorStats = [
  { title: "Total Events", value: "24", icon: "📅", color: "bg-primary-subtle text-primary", href: "/club-coordinator/events" },
  { title: "Upcoming Events", value: "08", icon: "🎯", color: "bg-secondary text-secondary-foreground", href: "/club-coordinator/events" },
  { title: "Pending Requests", value: "03", icon: "⏳", color: "bg-accent-subtle text-accent", href: "/club-coordinator/request-event" },
  { title: "Events Completed", value: "16", icon: "✅", color: "bg-secondary text-text-muted", href: "/club-coordinator/events" },
];

const coordinatorEvents = [
  { title: "TechFest 2026", date: "15", month: "NOV", category: "Technical", status: "Approved", color: "bg-primary-subtle text-primary" },
  { title: "Cultural Fusion", date: "20", month: "NOV", category: "Cultural", status: "Pending", color: "bg-accent-subtle text-accent" },
  { title: "Campus Football Cup", date: "25", month: "NOV", category: "Sports", status: "Approved", color: "bg-secondary text-secondary-foreground" },
];

const activities = [
  { title: "Event proposal submitted", description: "Your event proposal was submitted for approval.", date: "2 hours ago", icon: "📝" },
  { title: "Student membership updated", description: "A membership request was updated.", date: "Yesterday", icon: "👥" },
  { title: "Event details updated", description: "You updated your event information.", date: "2 days ago", icon: "📅" },
];

const coordinatorQuickActions = [
  { title: "View Events", description: "Manage your club events", icon: "📅", href: "/club-coordinator/events" },
  { title: "Request an Event", description: "Submit a new event proposal", icon: "📝", href: "/club-coordinator/request-event" },
];

const studentMenu = [
  { label: "Overview", href: "/student/dashboard", icon: "⌂" },
  { label: "My Profile", href: "/student/profile", icon: "👤" },
  { label: "Clubs", href: "/student/clubs", icon: "🤝" },
  { label: "Events", href: "/student/events", icon: "📅" },
  { label: "Study Resources", href: "/student/resources", icon: "📚" },
  { label: "Study Groups", href: "/student/study-groups", icon: "👥" },
  { label: "Lost & Found", href: "/student/lost-found", icon: "🔎" },
  { label: "Report an Issue", href: "/student/issues", icon: "📝" },
];

const coordinatorMenu = [
  { label: "Dashboard", href: "/club-coordinator/dashboard", icon: "▦" },
  { label: "My Events", href: "/club-coordinator/events", icon: "📅" },
  { label: "Request Event", href: "/club-coordinator/request-event", icon: "📝" },
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
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-muted hover:bg-secondary lg:hidden">✕</button>
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
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">✨</div>
              <h3 className="font-bold">Make campus life count!</h3>
              <p className="mt-2 text-xs leading-5 text-white/80">Join a club, attend an event, and discover new opportunities.</p>
              <Link href="/student/clubs" className="mt-4 flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-primary transition hover:bg-blue-50">Find your community →</Link>
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
            <button type="button" onClick={handleLogout} disabled={isSigningOut} title="Log out" aria-label="Log out" className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50">{isSigningOut ? "…" : "↗"}</button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[270px]">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
          <div className="flex min-h-[82px] flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open navigation" className="rounded-xl border border-border p-2.5 text-primary hover:bg-secondary lg:hidden">☰</button>
              <div>
                <p className="text-sm font-bold text-text">{dashboardMode === "student" ? "Student Dashboard" : "Club Coordinator Dashboard"}</p>
                <p className="hidden text-xs text-muted sm:block">{dashboardMode === "student" ? "Your personal campus space" : "Manage your club activities"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {dashboardMode === "student" && (
                <label className="hidden min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 md:flex">
                  <span className="text-muted">⌕</span>
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-36 bg-transparent text-sm outline-none placeholder:text-subtle lg:w-48" />
                </label>
              )}

              {isCoordinator && (
                <button type="button" onClick={() => { setDashboardMode((mode) => mode === "student" ? "coordinator" : "student"); setMobileMenuOpen(false); }} className="rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:px-4">
                  <span className="sm:hidden">{dashboardMode === "student" ? "Coordinator →" : "← Student"}</span>
                  <span className="hidden sm:inline">{dashboardMode === "student" ? "Switch to Coordinator" : "Switch to Student"}</span>
                </button>
              )}

              <button type="button" onClick={handleLogout} disabled={isSigningOut} className="rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                {isSigningOut ? "Signing out..." : <><span className="sm:hidden">↗</span><span className="hidden sm:inline">Log out</span></>}
              </button>
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
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Hey, {firstName}! 👋<br /><span className="text-blue-100">Ready to make today count?</span></h1>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-blue-50/90 sm:text-base">Discover new opportunities, connect with your campus community, and make every college day meaningful.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href="/studentEvents" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50">Explore Events <span>→</span></Link>
                      <Link href="/student/clubs" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20">Discover Clubs</Link>
                    </div>
                  </div>
                  <div className="hidden lg:flex"><div className="flex h-44 w-44 items-center justify-center rounded-[36px] border border-white/20 bg-white/10 text-8xl shadow-2xl backdrop-blur-sm">🎓</div></div>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs text-blue-50/90"><span>📚 Learn something new</span><span>🤝 Meet your community</span><span>🚀 Build your future</span></div>
              </section>

              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Your overview</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Your campus at a glance</h2><p className="mt-1 text-sm text-muted">Everything you need for a productive campus life.</p></div>
                  <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">Student workspace</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {studentStats.map((stat) => <Link href={stat.href} key={stat.title} className="group rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"><div className="flex items-start justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${stat.color}`}>{stat.icon}</div><span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">→</span></div><p className="mt-5 text-sm font-medium text-muted">{stat.title}</p><span className="mt-1 block text-3xl font-extrabold tracking-tight">{stat.value}</span><p className="mt-2 text-xs text-subtle">{stat.description}</p></Link>)}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
                <div className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Don't miss out</p><h2 className="mt-1 text-xl font-extrabold">Upcoming Events</h2><p className="mt-1 text-sm text-muted">What's happening around your campus.</p></div><Link href="/student/events" className="shrink-0 rounded-lg px-2 py-2 text-sm font-bold text-primary hover:bg-primary-subtle">View all →</Link></div>
                  <div className="mb-4 md:hidden"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events..." className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary" /></div>
                  <div className="space-y-4">
                    {filteredEvents.length ? filteredEvents.map((event) => <article key={event.id} className="group flex gap-4 rounded-2xl border border-border-subtle p-4 transition hover:border-primary/30 hover:bg-primary/[0.02]"><div className="flex w-[68px] shrink-0 flex-col items-center justify-center self-start rounded-xl bg-primary-subtle px-2 py-3 text-center"><span className="text-[10px] font-bold uppercase tracking-wider text-primary">{event.date.split(" ")[0]}</span><span className="mt-0.5 text-2xl font-extrabold text-primary">{event.date.split(" ")[1]}</span></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-text transition group-hover:text-primary">{event.name}</h3><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-muted">{event.category}</span></div><p className="mt-2 text-sm leading-6 text-muted">{event.description}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-subtle"><span>◷ {event.time}</span><span>⌖ {event.venue}</span></div></div><span className="hidden text-2xl sm:block">{event.icon}</span></article>) : <div className="rounded-xl border border-dashed border-border p-8 text-center"><p className="text-2xl">🔎</p><p className="mt-2 font-semibold">No events found</p><p className="mt-1 text-sm text-muted">Try searching with a different keyword.</p></div>}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <div className="mb-6 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">Stay informed</p><h2 className="mt-1 text-xl font-extrabold">Campus Updates</h2><p className="mt-1 text-sm text-muted">The latest news and announcements.</p></div><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-xl">📢</div></div>
                  <div className="space-y-5">{announcements.map((announcement) => <article key={announcement.id} className="flex gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${announcement.color}`}>{announcement.icon}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">{announcement.title}</h3><span className="text-[10px] text-subtle">{announcement.date}</span></div><p className="mt-1 text-xs leading-5 text-muted">{announcement.message}</p><span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted">{announcement.type}</span></div></article>)}</div>
                  <Link href="/student/announcements" className="mt-6 flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-primary-subtle">View all announcements →</Link>
                </div>
              </section>

              <section>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">Find your people</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Discover Campus Clubs</h2><p className="mt-1 text-sm text-muted">Meet people who share your interests.</p></div><Link href="/student/clubs" className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary-subtle">Explore all clubs →</Link></div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{clubs.map((club) => <article key={club.id} className="group overflow-hidden rounded-2xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"><div className={`flex h-32 items-center justify-center bg-gradient-to-br ${club.color}`}><span className="text-5xl transition duration-300 group-hover:scale-110">{club.icon}</span></div><div className="p-5"><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">{club.category}</span><h3 className="mt-3 text-lg font-extrabold">{club.name}</h3><p className="mt-1 text-sm text-muted">{club.members}</p><Link href="/student/clubs" className="mt-5 flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-bold text-primary transition hover:border-primary hover:bg-primary-subtle">View club details <span>→</span></Link></div></article>)}</div>
              </section>

              <section>
                <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Get things done</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight">Quick Actions</h2><p className="mt-1 text-sm text-muted">Jump straight to what you need.</p></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{studentQuickActions.map((action) => <Link key={action.title} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-105 ${action.color}`}>{action.icon}</div><div className="min-w-0 flex-1"><h3 className="font-bold transition group-hover:text-primary">{action.title}</h3><p className="mt-1 text-xs leading-5 text-muted">{action.description}</p></div><span className="text-lg text-subtle transition group-hover:translate-x-1 group-hover:text-primary">→</span></Link>)}</div>
              </section>

              <footer className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-center text-xs text-subtle sm:flex-row sm:text-left"><p>© {new Date().getFullYear()} EduNex. Built for a better campus experience.</p><div className="flex items-center gap-4"><Link href="/student/profile" className="transition hover:text-primary">My Profile</Link><Link href="/student/issues" className="transition hover:text-primary">Help & Support</Link></div></footer>
            </>
          ) : (
            <>
              <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9">
                <div className="relative z-10 max-w-2xl"><p className="text-sm font-medium opacity-80">CLUB MANAGEMENT ✨</p><h1 className="mt-3 text-2xl font-bold sm:text-3xl">Welcome back, {coordinatorName}!</h1><p className="mt-3 max-w-lg text-sm leading-6 opacity-90 sm:text-base">Manage your club activities, organize campus events, and keep students informed. Everything you need to coordinate your club is in one place.</p><Link href="/club-coordinator/request-event" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary">Request an Event <span>→</span></Link></div>
                <div className="pointer-events-none absolute -right-8 -top-12 text-[180px] opacity-15">🎓</div>
              </section>

              <section><div><h2 className="text-2xl font-bold">Club Overview</h2><p className="mt-1 text-sm text-text-muted">A quick look at your club activities.</p></div>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{coordinatorStats.map((stat) => <Link key={stat.title} href={stat.href} className="block rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-text-muted">{stat.title}</p><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}>{stat.icon}</span></div><p className="mt-4 text-3xl font-bold">{stat.value}</p><p className="mt-2 text-xs text-text-subtle">View details →</p></Link>)}</div>
              </section>

              <div className="grid gap-8 xl:grid-cols-5">
                <section className="xl:col-span-3"><div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Upcoming Events</h2><p className="mt-1 text-sm text-text-muted">Stay updated with your club events.</p></div><Link href="/club-coordinator/events" className="shrink-0 text-sm font-semibold text-primary hover:underline">View all →</Link></div>
                  <div className="space-y-3">{coordinatorEvents.map((event) => <article key={event.title} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition hover:border-primary hover:shadow-md sm:p-5"><div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-subtle text-primary"><span className="text-xl font-bold">{event.date}</span><span className="text-xs font-semibold">{event.month}</span></div><div className="min-w-0 flex-1"><h3 className="font-semibold">{event.title}</h3><p className="mt-1 text-sm text-text-muted">Campus Event</p><span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${event.color}`}>{event.category}</span></div><div className="flex shrink-0 flex-col items-end gap-2"><span className={`rounded-full px-2 py-1 text-xs font-medium ${event.status === "Approved" ? "bg-primary-subtle text-primary" : "bg-secondary text-text-muted"}`}>{event.status}</span><Link href="/club-coordinator/events" aria-label={`View ${event.title}`} className="text-xl text-text-subtle hover:text-primary">→</Link></div></article>)}</div>
                </section>
                <section className="xl:col-span-2"><div><h2 className="text-xl font-bold">Recent Activities</h2><p className="mt-1 text-sm text-text-muted">Your latest club updates.</p></div><div className="mt-5 rounded-2xl border border-border bg-surface p-5">{activities.map((activity, index) => <article key={activity.title} className={`flex gap-3 py-4 first:pt-0 last:pb-0 ${index !== activities.length - 1 ? "border-b border-border-subtle" : ""}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">{activity.icon}</div><div><h3 className="text-sm font-semibold leading-5">{activity.title}</h3><p className="mt-1 text-xs leading-5 text-text-muted">{activity.description}</p><p className="mt-2 text-xs text-primary">{activity.date}</p></div></article>)}</div></section>
              </div>

              <section><div><h2 className="text-2xl font-bold">Quick Actions</h2><p className="mt-1 text-sm text-text-muted">Jump directly to a club management service.</p></div><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{coordinatorQuickActions.map((action) => <Link key={action.title} href={action.href} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary hover:shadow-lg"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-2xl">{action.icon}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{action.title}</h3><p className="mt-1 text-sm text-text-muted">{action.description}</p></div><span className="text-lg text-primary">→</span></Link>)}</div></section>

              <footer className="border-t border-border pt-6 text-center text-sm text-text-muted">© {new Date().getFullYear()} EduNex · Your campus, connected.</footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
