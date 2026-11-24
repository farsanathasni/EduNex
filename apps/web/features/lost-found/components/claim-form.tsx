"use client";

import { useState } from "react";

import {
  getLostFoundErrorMessage,
  useSubmitClaimMutation,
  type VerificationQuestionView,
} from "../api/lost-found-query";

interface ClaimFormProps {
  itemId: number;
  questions: VerificationQuestionView[];
  onSubmitted?: () => void;
}

export default function ClaimForm({
  itemId,
  questions,
  onSubmitted,
  studentStyle = false,
}: ClaimFormProps & { studentStyle?: boolean }) {
  const submitClaim = useSubmitClaimMutation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await submitClaim.mutateAsync({
        id: itemId,
        input: {
          answers: questions.map((question) => ({
            id: question.id,
            answer: answers[question.id] ?? "",
          })),
        },
      });

      setAnswers({});
      onSubmitted?.();
    } catch (mutationError) {
      setError(getLostFoundErrorMessage(mutationError));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-4 border border-border bg-surface p-5 ${studentStyle ? "rounded-3xl" : "rounded-2xl"}`}
    >
      <div>
        <h3 className="font-semibold text-text">Claim this item</h3>
        <p className="mt-1 text-sm text-text-muted">
          Answer the finder&apos;s questions. Your answers are never shown to
          you alongside the expected answers.
        </p>
      </div>

      {questions.map((question) => (
        <label key={question.id} className="block space-y-2">
          <span className="text-sm font-medium text-text">
            {question.prompt}
          </span>
          <input
            required
            maxLength={200}
            value={answers[question.id] ?? ""}
            onChange={(event) =>
              setAnswers((current) => ({
                ...current,
                [question.id]: event.target.value,
              }))
            }
            className="min-h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
          />
        </label>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitClaim.isPending}
        className="min-h-11 w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:w-auto"
      >
        {submitClaim.isPending ? "Submitting..." : "Submit claim"}
      </button>
    </form>
  );
}
