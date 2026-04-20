type ErrorDetails = {
  name?: string;
  message: string;
  code?: string;
  stack?: string;
  cause?: unknown;
  details?: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getErrorDetails(error: unknown): ErrorDetails {
  if (typeof error === "string") {
    return { message: error };
  }

  if (!isRecord(error)) {
    return { message: String(error) };
  }

  const { name, message, stack, cause, code, ...rest } = error;
  const details = Object.keys(rest).length ? rest : undefined;

  return {
    name: typeof name === "string" ? name : undefined,
    message: typeof message === "string" ? message : "Unknown error",
    code:
      typeof code === "string" ? code : typeof code === "number" ? String(code) : undefined,
    stack: typeof stack === "string" ? stack : undefined,
    cause,
    details
  };
}
