"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CourseForm, { type CourseFormValues } from "../CourseForm";

export default function NewCoursePage() {
  const router = useRouter();

  const handlePublish = async (data: CourseFormValues) => {
    console.log("Publishing course:", { ...data, status: "published" });
    toast.success("Course created", {
      description: `${data.title} is now live.`,
    });
    router.push("/dashboard/courses");
  };

  const handleSaveDraft = async (data: Partial<CourseFormValues>) => {
    console.log("Saving draft:", { ...data, status: "draft" });
    toast.info("Draft saved", {
      description: "Your course draft was saved successfully.",
    });
  };

  const handleCancel = () => {
    router.push("/dashboard/courses");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            Course management
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
        </div>
      </div>

      <CourseForm
        mode="create"
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
      />
    </div>
  );
}
