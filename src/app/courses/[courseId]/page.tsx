"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import * as React from "react";
import { notFound } from "next/dist/client/components/not-found";
import { FileText, FileTextIcon, Lock } from "lucide-react";
import PerchaseButton from "../../../components/perchaseButton";
type Props = {
  params: Promise<{ courseId: string }>;
};

export default function CoursePage({ params }: Props) {
  // Use React.use() to unwrap the params Promise in a Client Component
  const { courseId } = React.use(params);
  const convexCourseId = courseId as Id<"courses">;

  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();

  // Fetch user data via Convex query
  const userData = useQuery(
    api.users.getUserByClerkId,
    isSignedIn && user?.id ? { clerkId: user.id } : "skip",
  );

  // Fetch course data via Convex query
  const courseData = useQuery(api.courses.getCourseById, {
    courseId: convexCourseId,
  });

  // Fetch user access, skipping if userData hasn't loaded yet
  const userAccess = useQuery(
    api.users.getUserAccess,
    isSignedIn && userData
      ? { userId: userData._id, courseId: convexCourseId }
      : "skip",
  ) || { hasAccess: false };

  // Handle loading states
  if (
    !isUserLoaded ||
    courseData === undefined ||
    (isSignedIn && userData === undefined)
  ) {
    return <div>Loading...</div>;
  }

  // Handle "not found" states
  if (courseData === null) {
    return <div>Course not found</div>;
  }

  if (courseData === null) {
    return notFound();
  }

  return (
    <div>
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            {courseData.imageUrl && (
              <Image
                src={courseData.imageUrl}
                alt={courseData.title}
                width={1200}
                height={600}
                className="rounded-md object-cover w-full"
              />
            )}
          </CardHeader>

          <CardContent>
            <CardTitle className="text-3xl mb-4">{courseData.title}</CardTitle>
            {userAccess.hasAccess ? (
              <>
                <p className="text-gray-600 mb-6">{courseData.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button className="flex items-center justify-center space-x-2">
                    <span> start course</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2">
                    <span> download materials</span>
                  </button>
                </div>
                <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <FileTextIcon className="size-5 text-gray-400" />
                    <span>Introduction to Advanced Patterns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span>Hooks and Custom Hooks</span>
                  </li>
                </ul>
              </>
            ) : (
              <div className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Lock className="w-16 h-16 text-gray-400" />
                  <p className="text-lg text-gray-600">
                    This course is locked.
                  </p>
                  <p className="text-gray-500 mb-4">
                    Enroll in this course to access all premium content.
                  </p>
                  <p className="text-2xl font-bold mb-4">
                    ${courseData.price.toFixed(2)}
                  </p>
                  <PerchaseButton courseId={convexCourseId} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
