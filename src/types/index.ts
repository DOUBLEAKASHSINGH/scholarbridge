export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  educationLevel?: string;
  fieldOfStudy?: string;
  countryOfResidence?: string;
  financialNeed?: string;
  createdAt: number;
}

export type OpportunityType = 'scholarship' | 'internship' | 'grant';

export interface OpportunityEligibility {
  degreeLevel?: string[];
  targetCountries?: string[];
  incomeCeiling?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  deadline: number; // Unix timestamp
  eligibility: string; // Legacy string
  targetCountry?: string; // Legacy
  amount?: string; // Legacy
  provider: string;
  
  // New Expanded Fields
  fundingAmount?: string; 
  eligibilityObject?: OpportunityEligibility;
  location?: "Remote" | "On-site" | "International";
  sourceUrl?: string;
  
  createdAt: number;
}

export type SavedOpportunityStatus = 'Saved' | 'Applied';

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  status: SavedOpportunityStatus;
  savedAt: number;
}
