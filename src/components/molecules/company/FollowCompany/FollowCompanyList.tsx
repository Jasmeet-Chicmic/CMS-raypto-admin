"use client";

import FollowCompanyCard, { FollowCompanyCardProps } from "./FollowCompanyCard";

interface FollowCompanyListProps {
  companies: FollowCompanyCardProps[];
}

const FollowCompanyList = ({ companies }: FollowCompanyListProps) => {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <div className="flex-col justify-between items-center">
        <h3 className="text-lg font-semibold">Following companies</h3>
        <div className="text-sm">Companies following your page.</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company, idx) => (
          <FollowCompanyCard
            key={idx}
            logo={company.logo}
            name={company.name}
            description={company.description}
            industry={company.industry}
          />
        ))}
      </div>
    </div>
  );
};
export default FollowCompanyList;
