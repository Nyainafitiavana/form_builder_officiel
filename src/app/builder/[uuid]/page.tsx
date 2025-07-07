import BuilderPageClient from "./BuilderPageClient";

export default async function BuilderPage({ params }: { params: Promise<{ uuid: string }> }) {
  const resolvedParams = await params;

  return <BuilderPageClient uuid={resolvedParams.uuid} />;
}
