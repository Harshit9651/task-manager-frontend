import { notificationApi, type NotificationPreferencePayload } from '../api/notification.api';
import { getUser, setUser } from '../../utils/storage';
import type { IUser } from '../../types/auth';

const DEFAULTS = {
  dailyFollowUpReminder: true,
  weeklyReport: true,
  timezone:'Asia/Kolkata',
};

class NotificationService {
  async updatePreferences(payload: NotificationPreferencePayload): Promise<IUser> {
    const response = await notificationApi.update(payload);
    setUser(response.data.user);
    return response.data.user;
  }


  setDailyReminder(enabled: boolean) {
    return this.updatePreferences({ dailyFollowUpReminder: enabled });
  }

  setWeeklyReport(enabled: boolean) {
    return this.updatePreferences({ weeklyReport: enabled });
  }

  setTimezone(timezone: string) {
    return this.updatePreferences({ timezone });
  }

  getPreferences() {
    const prefs = getUser()?.notificationPreferences;
    return {
      dailyFollowUpReminder: prefs?.dailyFollowUpReminder ?? DEFAULTS.dailyFollowUpReminder,
      weeklyReport: prefs?.weeklyReport ?? DEFAULTS.weeklyReport,
      timezone: prefs?.timezone ?? DEFAULTS.timezone,
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;