export interface CompanyOverviewFormData {
  companyName: string;
  sector: string;
  country: string;
  email: string;
  contactNumber: string;
  employeeCount: string;
  website: string;
  headquarters: string;
  services: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
}
