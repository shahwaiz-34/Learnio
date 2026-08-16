"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewCourseRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/courses/new");
  }, [router]);

  return null;
}
