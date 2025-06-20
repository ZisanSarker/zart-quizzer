import { Suspense } from "react";
import OAuthSuccessPage from "./OAuthSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Logging you in...</div>}>
      <OAuthSuccessPage />
    </Suspense>
  );
}