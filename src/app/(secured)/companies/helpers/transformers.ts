import { ENTITY_STATUS } from "@/shared/constants";
import { Company } from "@/shared/types";

// Extended Company interface for the table display
export interface CompanyTableData extends Company {
  createdBy: string;
  linkedUsersCount: number;
  status: ENTITY_STATUS;
  flagsCount: number;
}

// Transform API data to table format
export const transformCompanyData = (
  apiData: Company[],
): CompanyTableData[] => {
  return apiData.map((company) => ({
    ...company,
    // Mock data for missing fields - will be replaced when backend provides this data
    createdBy: "Admin User", // Mock: User who submitted the company
    linkedUsersCount: Math.floor(Math.random() * 50) + 1, // Mock: Count of users linked to the company
    status: getRandomStatus(), // Mock: Company status
    flagsCount: Math.floor(Math.random() * 5), // Mock: Number of times company has been flagged
  }));
};

// Helper function to get random status for mock data
const getRandomStatus = (): ENTITY_STATUS => {
  const statuses: ENTITY_STATUS[] = [
    ENTITY_STATUS.APPROVED,
    ENTITY_STATUS.PENDING,
    ENTITY_STATUS.REJECTED,
    ENTITY_STATUS.FLAGGED,
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Format date for display
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
