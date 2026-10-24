
"use client";

import { useState } from "react";
import CoordinatorLayout from "@/components/club-coordinator/CoordinatorLayout";
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
          <span className="text-xl">✓</span>
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
              Submit Event Request →
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-indigo-600 p-6 text-white">
            <div className="text-3xl">✦</div>
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
