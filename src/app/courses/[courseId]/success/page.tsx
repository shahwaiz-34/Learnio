"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import ConfirmCoursePurchase from "./ConfirmCoursePurchase";

const page = ({ params }: { params: { courseId?: string } }) => {
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [courseId, setCourseId] = useState<string | undefined>(params.courseId);

  useEffect(() => {
    if (!sessionId) {
      const fromQuery =
        searchParams.get("session_id") ||
        searchParams.get("sessionId") ||
        undefined;
      setSessionId(fromQuery ?? undefined);
    }
    if (!courseId) {
      const fromQuery =
        searchParams.get("courseId") ||
        searchParams.get("course_id") ||
        undefined;
      setCourseId(fromQuery ?? params.courseId);
    }
  }, [searchParams, sessionId, courseId, params.courseId]);

  const { user, isLoaded } = useUser();

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="size-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-green-700">
            Purchase Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-xl text-gray-600">
            Thank you for enrolling our course. Your journey to new skills and
            knowledge begins now!
          </p>

          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-500">
              Transaction ID: {sessionId ?? "Unavailable"}
            </p>
          </div>

          {isLoaded && user ? (
            <ConfirmCoursePurchase
              sessionId={sessionId ?? null}
              courseId={courseId}
            />
          ) : isLoaded && !user ? (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
              <p>
                You must sign in to confirm this purchase and unlock access.
              </p>
              <div className="mt-4">
                <SignInButton mode="modal">
                  <Button>Sign in to continue</Button>
                </SignInButton>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-700">
              Loading authentication state...
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href={courseId ? `/courses/${courseId}` : "/courses"}>
              <Button className="w-full sm:w-auto flex items-center justify-center">
                Go to Course
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse More Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default page;
