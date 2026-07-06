import leadApi from "../api/lead.api";

import type {
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadQuery,
  LeadStatus
} from "../../types/lead";

class LeadService {
 
  async createLead(payload: CreateLeadRequest) {
 const body = {
  ...payload,

  company: payload.company?.trim(),

  contactName: payload.contactName?.trim(),

  designation: payload.designation?.trim(),

  email: payload.email?.trim().toLowerCase(),

  phone: payload.phone?.trim(),

  linkedin: payload.linkedin?.trim(),

  website: payload.website?.trim(),

  country: payload.country?.trim(),

  city: payload.city?.trim(),

  notes: payload.notes?.trim(),

  tags: payload.tags?.map(tag => tag.trim()),
};

  return await leadApi.create(body);
  }

 
  async getLeads(query?: LeadQuery) {
    return await leadApi.getAll(query);
  }

 
  async getLead(id: string) {
    return await leadApi.getById(id);
  }

  
  async updateLead(
    id: string,
    payload: UpdateLeadRequest
  ) {
    return await leadApi.update(id, payload);
  }
  async updateStatus(id: string, status: LeadStatus) {
    return await leadApi.updateStatus(id, status);
  }

  
  async setFollowUp(id: string, nextFollowUp: string | null) {
    console.log("we are folloup service layer")
    return await leadApi.setFollowUp(id, nextFollowUp);
  }

  async deleteLead(id: string) {
    return await leadApi.delete(id);
  }
}

const leadService = new LeadService();

export default leadService;