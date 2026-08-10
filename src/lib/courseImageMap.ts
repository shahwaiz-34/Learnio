import coursesData from "../../coursesData.json";

type CourseData = {
  title: string;
  imageUrl: string;
};

const courseImageMap = new Map<string, string>(
  (coursesData as CourseData[]).map((course) => [
    course.title,
    course.imageUrl,
  ]),
);

export function getCourseImageUrl(course: {
  title: string;
  imageUrl?: string | null;
}) {
  const imageUrl = course.imageUrl;
  if (typeof imageUrl === "string" && imageUrl.startsWith("/")) {
    return imageUrl;
  }

  const fallback = courseImageMap.get(course.title);
  return fallback || imageUrl || "/course.jpg";
}
