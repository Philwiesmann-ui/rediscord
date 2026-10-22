import DMLayoutSkeleton from "@/components/islets/dm-layout/dm-layout-skeleton";
import DMLayout from "@/components/islets/dm-layout";
import DemoLoadingGate from "@/components/islets/demo-loading-gate";
import CommonLayout from "@/components/layout/common-layout";
import DemoBanner from "@/components/layout/demo-banner";

export const dynamic = "error";

export default function SuspendedDMLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <DemoBanner />
      <CommonLayout />
      <DemoLoadingGate fallback={<DMLayoutSkeleton>{children}</DMLayoutSkeleton>}>
        <DMLayout>{children}</DMLayout>
      </DemoLoadingGate>
    </>
  );
}
