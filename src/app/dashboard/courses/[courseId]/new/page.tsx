"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// 1. Zod Validation Schema
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  duration: z.string().min(1, "Course duration is required"),
  requirements: z.string().optional(),
  // For file uploads, Zod handles the file object or URL string depending on your upload strategy
  thumbnail: z.any().optional(), 
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function NewCoursePage() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      duration: "",
      requirements: "",
    },
  });

  // Action: Publish Course
  const onSubmitPublish = async (data: CourseFormValues) => {
    setIsPublishing(true);
    try {
      // Replace with your API call or backend mutation
      console.log("Publishing payload:", { ...data, status: "published" });
      
      // Sonner Toast notification
      toast.success("Course Published!", {
        description: `${data.title} is now live and available.`,
      });
    } catch (error) {
      toast.error("Failed to publish course. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Action: Save Draft (bypasses full strict validation if needed, or validates current fields)
  const onSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentData = getValues();
      console.log("Draft payload:", { ...currentData, status: "draft" });
      
      toast.info("Draft Saved", {
        description: "Your progress has been saved securely.",
      });
    } catch (error) {
      toast.error("Failed to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Action: Cancel
  const onCancel = () => {
    toast.warning("Action Cancelled", {
      description: "No changes were saved.",
    });
    // Add router.push('/dashboard') or equivalent navigation here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit(onSubmitPublish)}>
        
        {/* SECTION: Basic Information */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input
              {...register("title")}
              placeholder="e.g. Advanced Web Development"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="What will students learn in this course?"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                {...register("category")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a category...</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                {...register("duration")}
                placeholder="e.g. 10 hours, 4 weeks"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>
          </div>
        </section>

        {/* SECTION: Pricing */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Pricing</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("price")}
              placeholder="49.99"
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
          </div>
        </section>

        {/* SECTION: Thumbnail */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Course Thumbnail</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Drag and drop your thumbnail image here</p>
            <p className="text-xs mt-1">or click to browse files</p>
            <input 
              type="file" 
              className="hidden" 
              id="thumbnail-upload" 
              accept="image/*"
              {...register("thumbnail")} 
            />
            <label 
              htmlFor="thumbnail-upload" 
              className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
            >
              Select Image
            </label>
          </div>
        </section>

        {/* SECTION: Course Content */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Course Content</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites & Requirements</label>
            <textarea
              {...register("requirements")}
              rows={3}
              placeholder="What should students know before starting?"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </section>

        {/* SECTION: Publish / Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 pb-10">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-70"
          >
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </button>
          
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
          >
            {isPublishing ? "Publishing..." : "Publish Course"}
          </button>
        </div>
      </form>
    </div>
  );
}