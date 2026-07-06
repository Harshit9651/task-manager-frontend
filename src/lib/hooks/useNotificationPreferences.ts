import { useState } from 'react';
import notificationService from '../services/notification.service';
import { showToast } from '../../utils/toast';

type PrefField = 'dailyFollowUpReminder' | 'weeklyReport' | 'timezone';

interface Prefs {
  dailyFollowUpReminder: boolean;
  weeklyReport: boolean;
  timezone: string;
}

export function useNotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>(() => notificationService.getPreferences());
  const [savingField, setSavingField] = useState<PrefField | null>(null);

  const update = async <K extends PrefField>(field: K, value: Prefs[K]) => {
    const previous = prefs[field];
    if (previous === value) return;

    setPrefs((p) => ({ ...p, [field]: value }));
    setSavingField(field);
    try {
      const user = await notificationService.updatePreferences({ [field]: value });
 
      if (user.notificationPreferences) {
        setPrefs({
          dailyFollowUpReminder: user.notificationPreferences.dailyFollowUpReminder,
          weeklyReport: user.notificationPreferences.weeklyReport,
          timezone: user.notificationPreferences.timezone,
        });
      }
      showToast.success('Preferences updated');
    } catch (err) {
      setPrefs((p) => ({ ...p, [field]: previous }));
      showToast.error('Could not update preferences');
      console.error(err);
    } finally {
      setSavingField(null);
    }
  };

  return {
    prefs,
    savingField,
    setDailyReminder: (v: boolean) => update('dailyFollowUpReminder', v),
    setWeeklyReport: (v: boolean) => update('weeklyReport', v),
    setTimezone: (v: string) => update('timezone', v),
  };
}