import { Suspense } from "react";

import Content from "./content";

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}
