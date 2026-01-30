import { getSlideById } from "@/api/bonusSlides";
import SlideForm from "@/components/molecules/SlideForm/SlideForm";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) => {
  const { id } = await searchParams;

  if (!id) {
    return <div className="p-6">Slide ID is required</div>;
  }

  const slideData = await getSlideById(id);

  if (!slideData.status || !slideData.data) {
    return <div className="p-6">Error fetching slide data</div>;
  }

  return (
    <div className="bg-bgwhite rounded-[24px] dark:bg-darkbgprimary">
      <div className="p-6 rounded-[24px] dark:bg-darkbgprimary dark:border-darkbordercolor1">
        <SlideForm
          isEdit={true}
          slideId={id}
          defaultValues={{
            title: slideData.data.title,
            isActive: slideData.data.isActive,
            bonuses: slideData.data.bonuses,
          }}
        />
      </div>
    </div>
  );
};

export default page;
