import { isAxiosError } from "axios";

type StaffApiErrorResponse = {
  message?: string;
  errors?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

export function getStaffApiError(error: unknown) {
  if (isAxiosError<StaffApiErrorResponse>(error)) {
    const response = error.response?.data;
    const fieldErrors = Object.entries(response?.errors?.fieldErrors ?? {})
      .flatMap(([field, messages]) =>
        (messages ?? []).map((message) => `${field}: ${message}`),
      );
    return {
      message:
        response?.message ??
        error.message ??
        "Unable to save staff details. Please try again.",
      details: [
        ...(response?.errors?.formErrors ?? []),
        ...fieldErrors,
      ],
    };
  }

  return {
    message:
      error instanceof Error
        ? error.message
        : "Unable to save staff details. Please try again.",
    details: [],
  };
}
