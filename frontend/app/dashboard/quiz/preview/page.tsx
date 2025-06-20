import { Suspense } from "react";
import QuizPreviewPage from "./QuizPreviewPage";

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizPreviewPage />
    </Suspense>
  );
}