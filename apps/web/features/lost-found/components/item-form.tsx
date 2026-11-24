"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LOST_FOUND_CATEGORIES,
  getLostFoundErrorMessage,
  useCreateLostFoundItemMutation,
  type LostFoundCategory,
} from "../api/lost-found-query";
import { LOST_FOUND_CATEGORY_LABELS } from "../utils/lost-found-ui";
import { lostFoundHref, type LostFoundPortal } from "../portal";

const MAX_PHOTOS = 3;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

interface QuestionDraft {
  prompt: string;
  answer: string;
}

const emptyQuestion = (): QuestionDraft => ({ prompt: "", answer: "" });

export default function ItemForm({ portal, studentStyle = false }: { portal: LostFoundPortal; studentStyle?: boolean }) {
  const router = useRouter();
  const createItem = useCreateLostFoundItemMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<LostFoundCategory>("other");
  const [place, setPlace] = useState("");
  const [dateFound, setDateFound] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    emptyQuestion(),
  ]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (
    index: number,
    field: keyof QuestionDraft,
    value: string,
  ) => {
    setQuestions((current) =>
      current.map((question, i) =>
        i === index ? { ...question, [field]: value } : question,
      ),
    );
  };

  const onPhotosChange = (files: FileList | null) => {
    const selected = Array.from(files ?? []);

    if (selected.length > MAX_PHOTOS) {
      setError(`You can attach at most ${MAX_PHOTOS} photos.`);
      return;
    }

    if (
      selected.some(
        (file) =>
          !ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE,
      )
    ) {
      setError("Use JPG, PNG or WEBP photos of 5 MB or smaller.");
      return;
    }

    setError(null);
    setPhotos(selected);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (photos.length === 0) {
      setError("Please attach at least one photo.");
      return;
    }

    try {
      const item = await createItem.mutateAsync({
        title,
        description,
        category,
        place,
        dateFound,
        questions,
        answers: questions.map((question, index) => ({
          id: `q${index + 1}`,
          answer: question.answer,
        })),
        photos,
      });

      router.push(lostFoundHref(portal, item.id));
    } catch (mutationError) {
      setError(getLostFoundErrorMessage(mutationError));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-6 border border-border bg-surface p-5 sm:p-6 ${studentStyle ? "rounded-3xl shadow-subtle" : "rounded-2xl"}`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-text">Title</span>
            <input
              required
              minLength={3}
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
            />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-text">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as LostFoundCategory)}
            className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
          >
            {LOST_FOUND_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {LOST_FOUND_CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-text">
            Where was it found?
          </span>
          <input
            required
            minLength={2}
            maxLength={255}
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-text">Date found</span>
          <input
            required
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={dateFound}
            onChange={(event) => setDateFound(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-text">Description</span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
        />
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">
              Verification questions
            </p>
            <p className="text-xs text-text-muted">
              Add 1-3 questions. Answers are hidden from claimants.
            </p>
          </div>
          {questions.length < 3 && (
            <button
              type="button"
              onClick={() => setQuestions((current) => [...current, emptyQuestion()])}
              className="min-h-11 rounded-xl border border-border px-3 py-1.5 text-sm text-text hover:bg-background"
            >
              Add question
            </button>
          )}
        </div>

        {questions.map((question, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-2"
          >
            <label className="space-y-2">
              <span className="text-xs font-medium text-text-muted">
                Question {index + 1}
              </span>
              <input
                required
                minLength={3}
                maxLength={300}
                value={question.prompt}
                onChange={(event) => updateQuestion(index, "prompt", event.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-medium text-text-muted">
                Expected answer
              </span>
              <input
                required
                maxLength={200}
                value={question.answer}
                onChange={(event) => updateQuestion(index, "answer", event.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
              />
            </label>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setQuestions((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
                className="justify-self-start text-xs text-red-600 hover:underline"
              >
                Remove question
              </button>
            )}
          </div>
        ))}
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-text">
          Photos (JPG, PNG or WEBP, up to 3)
        </span>
        <input
          required
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => onPhotosChange(event.target.files)}
          className="w-full text-sm text-text-muted"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className={`flex flex-col gap-3 ${studentStyle ? "sm:flex-row sm:justify-end" : "sm:flex-row sm:items-center"}`}>
        <button
          type="submit"
          disabled={createItem.isPending}
          className="min-h-11 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:w-auto"
        >
          {createItem.isPending ? "Posting..." : "Post item"}
        </button>
        <button
          type="button"
          onClick={() => router.push(lostFoundHref(portal))}
          className="min-h-11 w-full rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
