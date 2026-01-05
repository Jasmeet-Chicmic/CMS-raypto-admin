import CompanyEventsList from "./CompanyEventsList";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div>
      <CompanyEventsList companyId={id} />
    </div>
  );
};

export default Page;
