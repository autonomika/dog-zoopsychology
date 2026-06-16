import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { BehaviorAssessment } from "@/components/BehaviorAssessment";

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ retake?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/register");

  const params = await searchParams;
  const retake = params.retake === "1";

  if (user.behaviorType && !retake) redirect("/dashboard");

  return (
    <BehaviorAssessment
      initialProfile={{
        dogName: user.dogName ?? "",
        dogBreed: user.dogBreed ?? "",
        dogAge: user.dogAge ?? "",
      }}
      isRetake={retake}
    />
  );
}
