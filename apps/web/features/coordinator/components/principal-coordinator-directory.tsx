"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCoordinatorAssignments, useDeactivateCoordinator, useUpdateCoordinator } from "@/features/coordinator/api/coordinator-query";
import type { CoordinatorAssignment } from "@/features/coordinator/api/coordinators";
import { retryUnlessAuthError, useCreateCoordinator } from "@/features/coordinator/api/coordinator-query";
import { useClubsQuery } from "@/features/clubs/api/club-query";
import type { StudentListItem } from "@/features/students/api/student";
import { useStudents } from "@/features/students/api/student-query";

const PAGE_SIZE = 10;

export default function PrincipalCoordinatorDirectory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState("");
  const query = useCoordinatorAssignments({ search: search.trim(), page, limit: PAGE_SIZE });
  const updateMutation = useUpdateCoordinator();
  const deleteMutation = useDeactivateCoordinator();
  const assignments = query.data?.assignments ?? [];
  const pagination = query.data?.pagination;

  return (
    <>
      <section className="space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-3xl font-bold">Coordinator Management</h1><p className="mt-2 text-sm text-text-muted">Manage student assignments across all clubs and departments.</p></div>
          <Button onClick={() => setShowAssignModal(true)}>Assign Coordinator</Button>
        </header>
        {notice && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
        <section className="max-w-xl rounded-xl border border-border bg-surface p-5">
          <label htmlFor="principal-coordinator-search" className="mb-2 block text-sm font-medium">Search assignments</label>
          <Input id="principal-coordinator-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Student name, admission number, or club" />
        </section>
        <section className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><h2 className="font-semibold">Coordinator assignments</h2><p className="text-sm text-text-muted">{pagination?.total ?? 0} assignment(s)</p></div>
          {query.isPending ? <p className="p-8 text-center text-sm text-text-muted">Loading assignments...</p>
            : query.isError ? <div className="p-8 text-center"><p role="alert" className="text-sm text-red-600">{query.error instanceof Error ? query.error.message : "Unable to load assignments."}</p><Button variant="outline" size="sm" className="mt-4" onClick={() => void query.refetch()}>Try again</Button></div>
              : assignments.length === 0 ? <p className="p-8 text-center text-sm text-text-muted">No coordinator assignments found.</p>
                : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b border-border bg-background text-text-muted"><tr><th className="px-4 py-3 font-medium">Student</th><th className="px-4 py-3 font-medium">Admission number</th><th className="px-4 py-3 font-medium">Department</th><th className="px-4 py-3 font-medium">Assigned club</th><th className="px-4 py-3 font-medium">Appointed</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead>
                  <tbody>{assignments.map((assignment) => <AssignmentRow key={assignment.id} assignment={assignment} selectedClubId={selectedClubs[assignment.id] ?? String(assignment.clubId)} onClubChange={(id) => setSelectedClubs((current) => ({ ...current, [assignment.id]: id }))} updatePending={updateMutation.isPending} deletePending={deleteMutation.isPending} onUpdate={(clubId) => updateMutation.mutate({ assignmentId: assignment.id, input: { studentId: assignment.studentId, clubId } }, { onSuccess: () => { setNotice("Coordinator assignment updated."); setSelectedClubs((current) => ({ ...current, [assignment.id]: String(clubId) })); } })} onDelete={() => { if (window.confirm(`Remove ${assignment.studentName}'s assignment to ${assignment.clubName}?`)) deleteMutation.mutate(assignment.id, { onSuccess: () => setNotice("Coordinator assignment removed.") }); }} />)}</tbody>
                </table></div>}
          {(updateMutation.error || deleteMutation.error) && <p role="alert" className="border-t border-border p-4 text-sm text-red-600">{updateMutation.error?.message || deleteMutation.error?.message}</p>}
          {!query.isPending && !query.isError && <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm"><p className="text-text-muted">Page {pagination?.page ?? page} of {Math.max(pagination?.totalPages ?? 0, 1)}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || query.isFetching} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button><Button variant="outline" size="sm" disabled={page >= (pagination?.totalPages ?? 0) || query.isFetching} onClick={() => setPage((current) => current + 1)}>Next</Button></div></footer>}
        </section>
      </section>
      {showAssignModal && <AssignCoordinatorModal onClose={() => setShowAssignModal(false)} onAssigned={() => { setShowAssignModal(false); setNotice("Coordinator assigned successfully."); setPage(1); }} />}
    </>
  );
}

function AssignmentRow({ assignment, selectedClubId, onClubChange, updatePending, deletePending, onUpdate, onDelete }: {
  assignment: CoordinatorAssignment;
  selectedClubId: string;
  onClubChange: (id: string) => void;
  updatePending: boolean;
  deletePending: boolean;
  onUpdate: (clubId: number) => void;
  onDelete: () => void;
}) {
  const clubsQuery = useClubsQuery(retryUnlessAuthError);
  const studentAssignmentsQuery = useCoordinatorAssignments({
    search: assignment.admissionNumber,
    page: 1,
    limit: 100,
  });
  const studentAssignments = (studentAssignmentsQuery.data?.assignments ?? []).filter(
    (item) => item.studentId === assignment.studentId,
  );
  const assignedClubIds = new Set(studentAssignments.map((item) => item.clubId));
  const clubs = (clubsQuery.data ?? []).filter(
    (club) =>
      club.departmentId === assignment.departmentId &&
      (club.id === assignment.clubId || !assignedClubIds.has(club.id)),
  );
  const loading = clubsQuery.isPending || studentAssignmentsQuery.isPending;
  return <tr className="border-b border-border last:border-0"><td className="px-4 py-3 font-medium">{assignment.studentName}</td><td className="px-4 py-3">{assignment.admissionNumber}</td><td className="px-4 py-3">{assignment.departmentName}</td><td className="px-4 py-3">{assignment.clubName}</td><td className="px-4 py-3">{new Date(assignment.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><div className="flex min-w-64 gap-2"><select aria-label={`Select replacement club for ${assignment.studentName}`} value={selectedClubId} onChange={(event) => onClubChange(event.target.value)} disabled={loading || updatePending || deletePending} className="min-w-32 flex-1 rounded-lg border border-border bg-background px-2 py-1.5">{clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}</select><Button size="sm" variant="outline" disabled={loading || updatePending || deletePending || Number(selectedClubId) === assignment.clubId} onClick={() => onUpdate(Number(selectedClubId))}>Change</Button><Button size="sm" variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" disabled={deletePending || updatePending} onClick={onDelete}>Remove</Button></div></td></tr>;
}

function AssignCoordinatorModal({ onClose, onAssigned }: { onClose: () => void; onAssigned: () => void }) {
  const [studentSearch, setStudentSearch] = useState("");
  const [studentPage, setStudentPage] = useState(1);
  const [student, setStudent] = useState<StudentListItem | null>(null);
  const [clubId, setClubId] = useState("");
  const studentsQuery = useStudents({ search: studentSearch.trim(), page: studentPage, limit: 10 });
  const clubsQuery = useClubsQuery(retryUnlessAuthError);
  const existingAssignmentsQuery = useCoordinatorAssignments(
    student ? { search: student.admissionNumber, page: 1, limit: 100 } : undefined,
    !!student,
  );
  const createMutation = useCreateCoordinator();
  const assignedClubIds = new Set((existingAssignmentsQuery.data?.assignments ?? []).filter((item) => item.studentId === student?.id).map((item) => item.clubId));
  const clubs = (clubsQuery.data ?? []).filter((club) => (!student || club.departmentId === student.departmentId) && !assignedClubIds.has(club.id));

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="assign-coordinator-title" className="w-full max-w-xl space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-xl">
    <header><h2 id="assign-coordinator-title" className="text-xl font-semibold">Assign Club Coordinator</h2><p className="mt-1 text-sm text-text-muted">Choose a student and one of their department&apos;s clubs.</p></header>
    {!student ? <div className="space-y-3"><label className="block space-y-1.5 text-sm font-medium"><span>Search students</span><Input value={studentSearch} onChange={(event) => { setStudentSearch(event.target.value); setStudentPage(1); }} placeholder="Name, admission number, or email" /></label>
      {studentsQuery.isPending ? <p className="text-sm text-text-muted">Loading students...</p> : studentsQuery.isError ? <p role="alert" className="text-sm text-red-600">{studentsQuery.error.message || "Unable to load students."}</p> : <><div className="max-h-52 overflow-y-auto rounded-lg border border-border">{(studentsQuery.data?.students ?? []).map((candidate) => <button type="button" key={candidate.id} onClick={() => { setStudent(candidate); setClubId(""); }} className="flex w-full justify-between border-b border-border px-3 py-2 text-left text-sm last:border-0 hover:bg-background"><span className="font-medium">{candidate.name}</span><span className="text-text-muted">{candidate.admissionNumber} · {candidate.departmentName}</span></button>)}</div><div className="flex justify-between text-xs text-text-muted"><span>{studentsQuery.data?.pagination.total ?? 0} students</span><div className="flex gap-2"><button type="button" disabled={studentPage <= 1} onClick={() => setStudentPage((value) => Math.max(1, value - 1))} className="underline disabled:opacity-50">Previous</button><button type="button" disabled={studentPage >= (studentsQuery.data?.pagination.totalPages ?? 0)} onClick={() => setStudentPage((value) => value + 1)} className="underline disabled:opacity-50">Next</button></div></div></>}
    </div> : <div className="space-y-4"><p className="rounded-lg bg-background p-3 text-sm"><strong>{student.name}</strong> · {student.admissionNumber} · {student.departmentName}<button type="button" onClick={() => setStudent(null)} className="ml-2 text-primary underline">Change</button></p>
      {clubsQuery.isPending || existingAssignmentsQuery.isPending ? <p className="text-sm text-text-muted">Loading clubs...</p> : clubsQuery.isError || existingAssignmentsQuery.isError ? <p role="alert" className="text-sm text-red-600">Unable to load clubs or assignments. <button type="button" className="underline" onClick={() => { void clubsQuery.refetch(); void existingAssignmentsQuery.refetch(); }}>Try again</button></p> : <label className="block space-y-1.5 text-sm font-medium"><span>Club</span><select value={clubId} onChange={(event) => setClubId(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2"><option value="">Select a club</option>{clubs.map((club) => <option key={club.id} value={club.id}>{club.name}</option>)}</select>{clubs.length === 0 && <span className="block text-xs font-normal text-text-muted">No unassigned clubs are available in this student&apos;s department.</span>}</label>}
    </div>}
    {createMutation.error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{createMutation.error.message || "Unable to assign coordinator."}</p>}
    <footer className="flex justify-end gap-3 border-t border-border pt-4"><Button variant="outline" onClick={onClose} disabled={createMutation.isPending}>Cancel</Button><Button disabled={!student || !clubId || createMutation.isPending} onClick={() => student && createMutation.mutate({ studentId: student.id, clubId: Number(clubId) }, { onSuccess: onAssigned })}>{createMutation.isPending ? "Assigning..." : "Assign"}</Button></footer>
  </section>
  </div>;
}
