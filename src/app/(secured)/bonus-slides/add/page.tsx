import SlideForm from "@/components/molecules/SlideForm/SlideForm";

const page = () => {
  return (
    <div className="bg-white rounded-[24px] dark:bg-gray-900">
      <div className="p-6 rounded-[24px] dark:bg-gray-900 dark:border-gray-800 create-slide">
        <div className="flex items-center justify-between w-full">
          <SlideForm />
        </div>
      </div>
    </div>
  );
};

export default page;
