"use client";

import React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  duration: z.string().min(1, "Course duration is required"),
  requirements: z.string().optional(),
  thumbnail: z.any().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

type Props = {
  initialValues?: Partial<CourseFormValues>;
  onPublish?: (data: CourseFormValues) => Promise<void> | void;
  onSaveDraft?: (data: Partial<CourseFormValues>) => Promise<void> | void;
  onCancel?: () => void;
};

export default function CourseForm({
  initialValues = {},
  onPublish,
  onSaveDraft,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema) as Resolver<CourseFormValues, any>,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      duration: "",
      requirements: "",
      ...initialValues,
    },
  });

  const publish = async (data: CourseFormValues) => {
    try {
      await onPublish?.(data);
    } catch (err) {
      toast.error("Failed to publish course");
    }
  };

  const saveDraft = async () => {
    const data = getValues();
    try {
      await onSaveDraft?.(data);
      toast.success("Draft saved");
    } catch (err) {
      toast.error("Failed to save draft");
    }
  };

  return (
    <form onSubmit={handleSubmit(publish)} className="space-y-8">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Basic Information
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Advanced Web Development"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="What will students learn in this course?"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select a category...</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              {...register("duration")}
              placeholder="e.g. 10 hours, 4 weeks"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements (optional)
            </label>
            <input
              {...register("requirements")}
              placeholder="e.g. Basic JS knowledge"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail URL (optional)
          </label>
          <input
            {...register("thumbnail")}
            placeholder="https://..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 justify-end border-t pt-4">
          <button
            type="button"
            onClick={saveDraft}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {isSubmitting ? "Saving..." : "Publish"}
          </button>
        </div>
      </section>
    </form>
  );
}
