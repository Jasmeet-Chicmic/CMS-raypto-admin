import React from "react";

import Header from "@/components/atoms/Header";
import Sidebar from "@/components/atoms/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const SecuredLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#ececf5] dark:bg-[#232e46]">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-72 py-6 pl-3">
        <div className="custom-container w-full">
          <Header />
          <main className="flex-1 mt-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default SecuredLayout;
