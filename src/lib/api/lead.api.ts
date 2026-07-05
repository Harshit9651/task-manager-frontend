import api from "./axios";
import Endpoints from "./endpoints";

import type {
  CreateLeadRequest,
  UpdateLeadRequest,
  LeadResponse,
  LeadsResponse,
  LeadQuery,LeadStatus
} from "../../types/lead";

class LeadApi {

  async create(payload: CreateLeadRequest) {
    const { data } = await api.post<LeadResponse>(
      Endpoints.leads.create(),
      payload
    );

    return data;
  }


  async getAll(query?: LeadQuery) {
    const { data } = await api.get<LeadsResponse>(
      Endpoints.leads.list(),
      {
        params: query,
      }
    );

    return data;
  }


  async getById(id: string) {
    const { data } = await api.get<LeadResponse>(
      Endpoints.leads.details(id)
    );

    return data;
  }

 
  async update(
    id: string,
    payload: UpdateLeadRequest
  ) {
    const { data } = await api.put<LeadResponse>(
      Endpoints.leads.update(id),
      payload
    );

    return data;
  }


  async delete(id: string) {
    const { data } = await api.delete(
      Endpoints.leads.delete(id)
    );

    return data;
  }
  async updateStatus(id: string, status: LeadStatus) {
    const { data } = await api.patch<LeadResponse>(
      Endpoints.leads.updateStatus(id),
      { status }
    );

    return data;
  }

  
  async setFollowUp(id: string, nextFollowUp: string | null) {
    console.log("we are in api layer")
    const { data } = await api.patch<LeadResponse>(
      Endpoints.leads.followUp(id),
      { nextFollowUp }
    );

    return data;
  }
}

export const leadApi = new LeadApi();

export default leadApi;