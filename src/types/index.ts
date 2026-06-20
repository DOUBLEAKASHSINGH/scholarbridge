export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Student Fields
  educationLevel?: string;
  fieldOfStudy?: string;
  institute?: string;
  countryOfResidence?: string;
  financialNeed?: string;
  genderIdentity?: string;
  specialDemographics?: string;
  resumeUrl?: string;
  sopUrl?: string;
  // Admin Fields
  organizationName?: string;
  contactEmail?: string;
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
  targetGender?: string;
  targetDemographic?: string;
  
  createdAt: number;
}

export type SavedOpportunityStatus = 'Saved' | 'Drafting Application' | 'Applied' | 'Result Pending';

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  status: SavedOpportunityStatus;
  savedAt: number;
}
