"use client";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import CourseForm, { type CourseFormValues } from "../../CourseForm";

const courseInitialValues: Partial<CourseFormValues> = {
  title: "Conversational Language Mastery",
  description:
    "Master conversational Spanish through immersive audio lessons, real-world scenario practice, and interactive dialogue exercises designed for beginner to intermediate learners.",
  price: 29.99,
  category: "languages",
  duration: "8 weeks",
  requirements: "Basic English proficiency",
  thumbnail: "/course.jpg",
};

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const handlePublish = async (data: CourseFormValues) => {
    console.log(`Updating course ${courseId}:`, {
      ...data,
      status: "published",
    });
    toast.success("Course updated", {
      description: `${data.title} has been updated successfully.`,
    });
    router.push(`/dashboard/courses/${courseId}`);
  };

  const handleSaveDraft = async (data: Partial<CourseFormValues>) => {
    console.log(`Saving draft for ${courseId}:`, { ...data, status: "draft" });
    toast.info("Draft updated", {
      description: "Your course changes were saved as a draft.",
    });
  };

  const handleCancel = () => {
    router.push(`/dashboard/courses/${courseId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            Course management
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        </div>
      </div>

      <CourseForm
        mode="edit"
        initialValues={courseInitialValues}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
      />
    </div>
  );
}
