import ServerView from "@/components/islets/server-view";

export const dynamic = "force-dynamic";

export default async function ServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServerView id={id} />;
}
