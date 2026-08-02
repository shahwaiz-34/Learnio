interface Props {
  params: {
    courseId: string;
  };
}

export default function DashboardEditCoursePage({ params }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Edit Course</h1>
      <p className="mt-4 text-muted-foreground">Editing course ID: {params.courseId}</p>
    </div>
  );
}