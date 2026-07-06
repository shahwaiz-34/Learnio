"use client";

import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CoursePurchaseSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmCheckoutSession = useAction(api.stripe.confirmCheckoutSession);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Confirming your purchase...");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("No checkout session ID was provided.");
      return;
    }

    const confirm = async () => {
      try {
        const result = await confirmCheckoutSession({ sessionId });
        setStatus("success");
        setMessage(result.message);
      } catch (error: any) {
        console.error("Confirm checkout session failed:", error);
        setStatus("error");
        setMessage(
          error?.message ||
            "We could not confirm the purchase. Please try again.",
        );
      }
    };

    confirm();
  }, [sessionId, confirmCheckoutSession]);

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-4">
          {status === "success" ? "Purchase complete!" : "Checkout status"}
        </h1>
        <p className="mb-6 text-slate-600">{message}</p>

        {status === "loading" ? (
          <div className="text-sm text-slate-500">Waiting for Stripe...</div>
        ) : (
          <div className="space-y-3">
            <Link href={`/courses/${params?.courseId ?? ""}`}>
              <Button variant="default">Return to course</Button>
            </Link>
            <p className="text-sm text-slate-500">
              If your course does not appear as unlocked right away, refresh the
              page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
