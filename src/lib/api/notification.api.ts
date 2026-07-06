import api from './axios';
import Endpoints from './endpoints';
import type { ApiEnvelope } from '../../types/api';
import type { IUser } from '../../types/auth';


export interface NotificationPreferencePayload {
  dailyFollowUpReminder?: boolean;
  weeklyReport?: boolean;
  timezone?: string;
}

class NotificationApi {
  async update(payload: NotificationPreferencePayload) {
    const { data } = await api.patch<ApiEnvelope<{ user: IUser }>>(
      Endpoints.user.notificationPreferences(),
      payload,
    );
    return data;
  }
}

export const notificationApi = new NotificationApi();
export default notificationApi;