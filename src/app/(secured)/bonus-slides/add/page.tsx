import SlideForm from "@/components/molecules/SlideForm/SlideForm";

const page = () => {
  return (
    <div className="bg-white rounded-[24px] dark:bg-[#1a1a1a]">
      <div className="p-6 rounded-[24px] dark:bg-[#1a1a1a] dark:border-[#1e2939] create-slide">
        <div className="flex items-center justify-between w-full">
          <SlideForm />
        </div>
      </div>
    </div>
  );
};

export default page;
