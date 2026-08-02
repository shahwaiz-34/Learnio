interface Props {
  params: {
    courseId: string;
  };
}

export default function DashboardCourseDetailsPage({ params }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Course Details</h1>
      <p className="mt-4 text-muted-foreground">Viewing details for course ID: {params.courseId}</p>
    </div>
  );
}