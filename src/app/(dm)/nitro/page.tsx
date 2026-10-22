import { Page, PageContent, PageHeader } from "@/components/layout/page";
import NitroView from "@/components/islets/nitro-view";
import { BsStars } from "react-icons/bs";

export const dynamic = "error";

export default function NitroPage() {
  return (
    <Page>
      <PageHeader>
        <div className="flex gap-4">
          <div className="flex flex-none items-center gap-2 text-sm font-semibold">
            <BsStars className="text-gray-500" fontSize={22} />
            Nitro
          </div>
        </div>
      </PageHeader>
      <PageContent>
        <NitroView />
      </PageContent>
    </Page>
  );
}
