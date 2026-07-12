"use client";

import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type Props = {
  sessionId: string | null;
  courseId?: string;
};

const ConfirmCoursePurchase = ({ sessionId, courseId }: Props) => {
  const [resolvedSessionId, setResolvedSessionId] = useState<string | null>(
    sessionId,
  );
  const [resolvedCourseId, setResolvedCourseId] = useState<string | undefined>(
    courseId,
  );
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const confirmCheckoutSession = useAction(api.stripe.confirmCheckoutSession);

  useEffect(() => {
    if (resolvedSessionId && resolvedCourseId) {
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    if (!resolvedSessionId) {
      const fromQuery =
        searchParams.get("session_id") || searchParams.get("sessionId");
      if (fromQuery) {
        setResolvedSessionId(fromQuery);
      }
    }
    if (!resolvedCourseId) {
      const fromQuery =
        searchParams.get("courseId") || searchParams.get("course_id");
      if (fromQuery) {
        setResolvedCourseId(fromQuery);
      }
    }
  }, [resolvedSessionId, resolvedCourseId]);

  useEffect(() => {
    if (!resolvedSessionId || status !== "idle") {
      return;
    }

    const runConfirmation = async () => {
      setStatus("loading");
      const maxRetries = 3;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await confirmCheckoutSession({
            sessionId: resolvedSessionId,
          });
          // log full result for debugging
          // keep a copy in state so users can optionally view it
          try {
            setDebugInfo(JSON.stringify(result, null, 2));
          } catch (_) {
            setDebugInfo(String(result));
          }
          if (result.success) {
            setStatus("success");
            if (resolvedCourseId) {
              window.setTimeout(() => {
                window.location.href = `/courses/${resolvedCourseId}`;
              }, 1000);
            }
            return;
          } else {
            const msg = result.message ?? "Unable to confirm checkout session.";
            setErrorMessage(msg);
            console.error("confirmCheckoutSession failed:", result);
            setStatus("error");
            return;
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "Unable to confirm checkout session.";
          // expose debug info for transient connectivity / convex errors
          try {
            setDebugInfo(
              JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
            );
          } catch (_) {
            setDebugInfo(String(error));
          }
          console.error("confirmCheckoutSession threw:", error);
          // If this was the last attempt, show error; otherwise wait and retry
          if (attempt === maxRetries - 1) {
            setErrorMessage(message);
            setStatus("error");
            return;
          }
          // transient error — wait with exponential backoff before retrying
          const backoff = 500 * Math.pow(2, attempt);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, backoff));
          // continue to next attempt
        }
      }
    };

    runConfirmation();
  }, [confirmCheckoutSession, resolvedCourseId, resolvedSessionId, status]);

  if (!resolvedSessionId) {
    return (
      <div className="rounded-md border border-orange-200 bg-orange-50 p-4 text-orange-700">
        Missing session ID. Your payment may still be processing; refresh the
        page or return to the course list.
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-700">
        Confirming your purchase and unlocking access...
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
        Purchase confirmed. Your course access is now unlocked.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        <p>Unable to confirm your purchase automatically.</p>
        <p className="mt-2 text-sm">{errorMessage}</p>
        <div className="mt-4 flex gap-2 justify-center">
          <button
            className="px-3 py-1 rounded bg-red-100 text-red-800 border border-red-200"
            onClick={() => {
              setErrorMessage(null);
              setStatus("idle");
            }}
          >
            Retry
          </button>
        </div>
        <div className="mt-3 text-center">
          <button
            className="text-sm text-blue-600 underline"
            onClick={() => setShowDetails((s) => !s)}
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
        </div>
        {showDetails && debugInfo ? (
          <pre className="mt-2 max-h-48 overflow-auto rounded bg-gray-100 p-2 text-left text-xs text-gray-700">
            {debugInfo}
          </pre>
        ) : null}
      </div>
    );
  }

  return null;
};

export default ConfirmCoursePurchase;
