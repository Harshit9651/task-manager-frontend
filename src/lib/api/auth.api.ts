import api from "./axios";
import Endpoints from "./endpoints";

import type {
  GoogleLoginRequest,
  IUser,
} from "../../types/auth";


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  user: IUser;
  accessToken: string;
}

export interface RefreshData {
  user: IUser;
  accessToken: string;
}

export interface MeData {
  user: IUser;
}


class AuthApi {

  async googleLogin(payload: GoogleLoginRequest) {
    const response = await api.post<ApiResponse<LoginData>>(
      Endpoints.auth.login(),
      payload
    );

    return response.data;
  }


  async me() {
    const response = await api.get<ApiResponse<MeData>>(
      Endpoints.auth.me()
    );

    return response.data;
  }

 
  async refresh() {
    const response = await api.post<ApiResponse<RefreshData>>(
      Endpoints.auth.refresh()
    );

    return response.data;
  }


  async logout() {
    const response = await api.post<ApiResponse<null>>(
      Endpoints.auth.logout()
    );

    return response.data;
  }
}

export const authApi = new AuthApi();

export default authApi;