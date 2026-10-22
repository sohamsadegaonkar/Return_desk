import { Suspense } from "react";
import { Queue } from "@/components/queue";
import { Loading, Shell } from "@/components/ui";
export default function Home() {
  return (
    <Shell>
      <Suspense fallback={<Loading />}>
        <Queue />
      </Suspense>
    </Shell>
  );
}
