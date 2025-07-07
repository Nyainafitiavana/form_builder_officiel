import BuilderPageClient from "./BuilderPageClient";

export default function BuilderPage({ params }: { params: { uuid: string } }) {
  return <BuilderPageClient uuid={params.uuid} />;
}
