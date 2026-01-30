import SlideForm from "@/components/molecules/SlideForm/SlideForm";

const page = () => {
  return (
    <div className="bg-bgwhite rounded-[24px] dark:bg-darkbgprimary">
      <div className="p-6 rounded-[24px] dark:bg-darkbgprimary dark:border-darkbordercolor1 create-slide">
        <div className="flex items-center justify-between w-full">
          <SlideForm />
        </div>
      </div>
    </div>
  );
};

export default page;
