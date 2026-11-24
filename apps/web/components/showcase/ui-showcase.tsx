"use client";

import { useState } from "react";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Badge, { type BadgeStatus } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Checkbox from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/date-picker";
import Dialog from "@/components/ui/dialog";
import type { DataTableColumn } from "@/components/ui/data-table";
import FileInput from "@/components/ui/file-input";
import Input from "@/components/ui/input";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import Pagination from "@/components/ui/pagination";
import { ResponsiveDataTable } from "@/components/ui/data-table";
import SearchInput from "@/components/ui/search-input";
import Select from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Switch from "@/components/ui/switch";
import Tabs, { type TabItem } from "@/components/ui/tabs";
import Textarea from "@/components/ui/textarea";

type SampleRow = {
  name: string;
  role: string;
  status: BadgeStatus;
  joined: string;
};

const sampleRows: SampleRow[] = [
  { name: "Amara Okafor", role: "Club Coordinator", status: "active", joined: "2026-01-12" },
  { name: "Noah Williams", role: "Faculty Adviser", status: "pending", joined: "2026-02-03" },
  { name: "Maya Chen", role: "Student Member", status: "approved", joined: "2026-03-18" },
];

const sampleColumns: DataTableColumn<SampleRow>[] = [
  {
    header: "Name",
    cell: (row) => row.name,
    mobileLabel: "Name",
    mobilePriority: "primary",
  },
  {
    header: "Role",
    cell: (row) => row.role,
    mobileLabel: "Role",
    mobilePriority: "secondary",
  },
  {
    header: "Status",
    cell: (row) => <Badge status={row.status}>{row.status}</Badge>,
    mobileLabel: "Status",
    mobilePriority: "secondary",
  },
  {
    header: "Joined",
    cell: (row) => row.joined,
    mobileLabel: "Joined",
    hidePriority: "low",
    mobilePriority: "hidden",
  },
];

const tabItems: TabItem<"overview" | "activity">[] = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
];

export default function UiShowcase() {
  const [headerSearch, setHeaderSearch] = useState("");
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("2026-01-15");
  const [notifications, setNotifications] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [tab, setTab] = useState<"overview" | "activity">("overview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [lastAction, setLastAction] = useState("No row action yet");

  useRegisterHeaderSearch({
    value: headerSearch,
    onChange: setHeaderSearch,
    placeholder: "Search components",
  });

  return (
    <PageContainer className="space-y-6 py-6">
      <PageHeader
        eyebrow="Development"
        title="UI foundation showcase"
        description="Shared tokens, primitives, form controls, feedback components, and responsive tables."
        breadcrumb={
          <span>
            <span className="text-primary">Dev</span> / UI
          </span>
        }
        action={<Badge tone="primary">Preview</Badge>}
        primaryAction={
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-section-title font-bold">Buttons</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Preview icon button">
              +
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-section-title font-bold">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="primary">Primary</Badge>
            <Badge tone="info" dot>
              Info
            </Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="accent">Accent</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge status="open">Open</Badge>
            <Badge status="pending">Pending</Badge>
            <Badge status="active">Active</Badge>
            <Badge status="rejected">Rejected</Badge>
          </div>
        </Card>
      </div>

      <Card className="space-y-4">
        <h2 className="text-section-title font-bold">Form controls</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Full name"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            helperText="Shown on your public profile."
          />
          <Input
            label="Email with error"
            defaultValue="invalid-email"
            error="Enter a valid email address."
          />
          <SearchInput
            label="Search"
            placeholder="Search people"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClear={() => setSearch("")}
          />
          <Select
            label="Role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="coordinator">Coordinator</option>
          </Select>
          <DatePicker
            label="Date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <FileInput label="Supporting document" helperText="PDF up to 10 MB." />
          <Textarea
            label="Notes"
            placeholder="Add notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
          <Checkbox
            label="I agree to the terms"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
          <Switch
            label="Email notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
            helperText="Receive a digest when activity changes."
          />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="text-section-title font-bold">Feedback</h2>
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton shape="badge" />
            <Skeleton shape="button" />
            <Skeleton shape="circle" className="h-10 w-10" />
          </div>
          <Tabs
            ariaLabel="Showcase tabs"
            items={tabItems}
            value={tab}
            onValueChange={setTab}
          />
          <p className="text-label text-text-muted">
            Selected tab: <span className="font-semibold text-text">{tab}</span>
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-section-title font-bold">Pagination</h2>
          <p className="text-label text-text-muted">
            Page controls wrap and stay reachable on small screens.
          </p>
          <Pagination
            page={page}
            totalPages={4}
            total={42}
            pageSize={10}
            showTotal
            onPageChange={setPage}
          />
          <p className="text-label text-text-muted">{lastAction}</p>
        </Card>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-section-title font-bold">Responsive data table</h2>
          <p className="mt-1 text-label text-text-muted">
            Desktop keeps the table; mobile switches to cards using the same rows and actions.
          </p>
        </div>
        <ResponsiveDataTable
          columns={sampleColumns}
          rows={sampleRows}
          caption="Sample members"
          emptyState="No members to show."
          getRowKey={(row) => row.name}
          rowActions={(row) => [
            {
              label: "View",
              onClick: () => setLastAction(`Viewed ${row.name}`),
            },
            {
              label: "Message",
              onClick: () => setLastAction(`Messaged ${row.name}`),
            },
          ]}
        />
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Dialog preview"
        description="Use the same dialog on desktop and as a bottom sheet on mobile."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </>
        }
      >
        <div className="space-y-3 text-label text-text-muted">
          <p>Dialog content scrolls independently when it is taller than the viewport.</p>
          <Input label="Label inside dialog" placeholder="Type something" />
        </div>
      </Dialog>
    </PageContainer>
  );
}
