"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  FileText,
  RefreshCw,
} from "lucide-react";

import { useRegisterHeaderSearch } from "@/components/layout/header-search";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import PageContainer from "@/components/ui/page-container";
import PageHeader from "@/components/ui/page-header";
import Select from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useStudentMaterialsQuery,
  type StudentStudyMaterial,
} from "@/features/resources/api/resources-query";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFileTypeLabel(material: StudentStudyMaterial): string {
  const declared = material.fileType?.trim();
  if (declared) return declared.toUpperCase();

  const extension = material.fileName?.split(".").pop()?.trim();
  return extension ? extension.toUpperCase() : "FILE";
}

export default function StudentStudyMaterialsPage() {
  const { data, isLoading, isError, refetch } = useStudentMaterialsQuery();
  const materials = data;
  const [search, setSearch] = useState("");
  const [fileType, setFileType] = useState("all");

  useRegisterHeaderSearch({
    value: search,
    onChange: setSearch,
    placeholder: "Search study materials by title or description",
  });

  const materialList = useMemo(() => materials ?? [], [materials]);

  const fileTypes = useMemo(
    () =>
      Array.from(
        new Set(
          materialList.map((material) => getFileTypeLabel(material)),
        ),
      ).sort(),
    [materialList],
  );

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return materialList.filter((material) => {
      const matchesSearch =
        !query ||
        material.title.toLowerCase().includes(query) ||
        (material.description ?? "").toLowerCase().includes(query);

      const matchesType =
        fileType === "all" || getFileTypeLabel(material) === fileType;

      return matchesSearch && matchesType;
    });
  }, [materialList, search, fileType]);

  const hasFilters = search.trim().length > 0 || fileType !== "all";

  if (isLoading) {
    return (
      <PageContainer className="space-y-6 py-6 sm:py-8">
        <PageHeader eyebrow="Learning resources" title="Study Materials" description="Learning resources shared by your faculty." />
        <div className="flex flex-col gap-3 sm:flex-row"><Skeleton className="h-11 w-full rounded-xl sm:max-w-sm" /><Skeleton className="h-11 w-full rounded-xl sm:w-52" /></div>
        <div aria-label="Loading study materials" role="status" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <span className="sr-only">Loading study materials…</span>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} padding="lg" className="space-y-4 rounded-3xl">
              <div className="flex items-start justify-between gap-3"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-5 w-14 rounded-md" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer className="space-y-6 py-6 sm:py-8">
        <PageHeader title="Study Materials" description="Learning resources shared by your faculty." />
        <div role="alert" className="flex flex-col gap-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-text">We couldn&apos;t load your study materials</p>
              <p className="mt-1 text-sm text-text-muted">Please check your connection and try again.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => void refetch()} className={`min-h-11 w-full sm:w-auto ${focusRing}`}>
            <RefreshCw aria-hidden="true" className="h-4 w-4" /> Try again
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 py-6 sm:py-8">
      <PageHeader
        eyebrow="Learning resources"
        title="Study Materials"
        description="Learning resources shared by your faculty."
        action={
          <p className="text-label text-text-muted" aria-live="polite">
            <span className="font-semibold text-text">{filteredMaterials.length}</span> material{filteredMaterials.length === 1 ? "" : "s"}
          </p>
        }
      />

      {materialList.length > 0 && (
        <section aria-label="Filter study materials" className="flex flex-wrap gap-3">
          <div className="min-w-0 flex-1 basis-full sm:basis-[220px] sm:max-w-xs">
            <Select
              id="study-materials-type"
              label="File type"
              value={fileType}
              onChange={(event) => setFileType(event.target.value)}
            >
              <option value="all">All file types</option>
              {fileTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
          {hasFilters && (
            <div className="flex min-w-0 flex-1 basis-full items-end sm:basis-[180px] sm:max-w-[220px]">
              <Button variant="outline" onClick={() => { setSearch(""); setFileType("all"); }} className={`min-h-11 w-full ${focusRing}`}>
                Clear filters
              </Button>
            </div>
          )}
        </section>
      )}

      {filteredMaterials.length === 0 ? (
        <Card padding="lg" className="rounded-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <FileText aria-hidden="true" className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-body-lg font-bold text-text">
            {hasFilters ? "No matching study materials" : "No study materials yet"}
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            {hasFilters ? "Try a different search or file type." : "Materials shared by your faculty will appear here."}
          </p>
          {hasFilters && (
            <Button variant="outline" onClick={() => { setSearch(""); setFileType("all"); }} className={`mt-5 min-h-11 w-full sm:w-auto ${focusRing}`}>
              Clear filters
            </Button>
          )}
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => {
            const uploadDate = formatUploadDate(material.createdAt);
            return (
              <li key={material.id} className="flex h-full min-w-0">
                <Card padding="lg" className="flex w-full min-w-0 flex-col rounded-3xl">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 min-w-0 break-words text-body font-bold leading-snug text-text">
                      {material.title}
                    </h2>
                    <span className="shrink-0 rounded-md bg-primary-subtle px-2 py-1 text-xs font-semibold text-primary">
                      {getFileTypeLabel(material)}
                    </span>
                  </div>
                  {material.description && (
                    <p className="mt-3 line-clamp-2 text-label leading-relaxed text-text-muted">{material.description}</p>
                  )}
                  <div className="mt-4 space-y-2 text-label text-text-muted">
                    {material.fileName && (
                      <div className="flex min-w-0 items-start gap-2">
                        <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-text" title={material.fileName}>{material.fileName}</p>
                          {material.fileSize !== null && <p className="text-xs">{formatFileSize(material.fileSize)}</p>}
                        </div>
                      </div>
                    )}
                    {uploadDate && <p className="text-xs">Uploaded {uploadDate}</p>}
                  </div>
                  <div className="mt-auto pt-5">
                    <Button
                      onClick={() => window.open(material.fileUrl, "_blank", "noopener,noreferrer")}
                      aria-label={`Open ${material.title} in a new tab`}
                      className={`min-h-11 w-full ${focusRing}`}
                    >
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                      Open material
                    </Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}
