export type LeadTemperature =
  | "hot"
  | "warm"
  | "cold"
  | "unknown";


export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "meeting_scheduled"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost"
  |"converted_to_client"

export type LeadSource =
  | "manual"
  | "linkedin"
  | "website"
  | "email"
  | "facebook"
  | "instagram"
  | "twitter"
  | "referral"
  | "cold_call"
  | "event"
  | "other";


export type CompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1000+";



export interface ILead {
  _id: string;

  user: string;

  company: string;

  contactName: string;

  designation?: string;

  email: string;

  phone?: string;

  linkedin?: string;

  website?: string;

  country?: string;

  city?: string;

  source: LeadSource;

  companySize?: CompanySize;

  temperature: LeadTemperature;

  status: LeadStatus;

  notes?: string;

  tags: string[];

  avatar?: string;

  lastContactedAt?: string;

  nextFollowUp?: string;

  isArchived: boolean;

  createdAt: string;

  updatedAt: string;
}


export interface CreateLeadRequest {
  company: string;

  contactName: string;

  designation?: string;

  email: string;

  phone?: string;

  linkedin?: string;

  website?: string;

  country?: string;

  city?: string;

  source?: LeadSource;

  companySize?: CompanySize;

  temperature?: LeadTemperature;

  status?: LeadStatus;

  notes?: string;

  tags?: string[];
}


export interface UpdateLeadRequest
  extends Partial<CreateLeadRequest> {}


export interface LeadResponse {
  success: boolean;

  message: string;

  data: {
    lead: ILead;
  };
}


export interface LeadsResponse {
  success: boolean;

  message: string;

  data: {
    leads: ILead[];

    total: number;

    page: number;

    limit: number;

    totalPages: number;
  };
}


export interface LeadQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: LeadStatus;

  temperature?: LeadTemperature;

  source?: LeadSource;

  companySize?: CompanySize;

  sortBy?: "createdAt" | "company" | "contactName";

  sortOrder?: "asc" | "desc";
}



export interface LeadStats {
  total: number;

  hot: number;

  warm: number;

  cold: number;

  unknown: number;

  won: number;

  lost: number;

  contacted: number;

  followUp: number;
  convertedToClient: number;


}