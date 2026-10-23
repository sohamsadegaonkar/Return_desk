import { Suspense } from "react";
import { RequestWorkspace } from "@/components/request-workspace";
import { Loading, Shell } from "@/components/ui";

async function RequestContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestWorkspace key={id} id={id} />;
}

export default function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Shell>
      <Suspense fallback={<Loading label="Opening request…" />}>
        <RequestContent params={params} />
      </Suspense>
    </Shell>
  );
}
