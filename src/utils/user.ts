import { axSaveFCMToken } from "@services/user.service";
import notification, { NotificationType } from "./notification";
import useTranslation from "@configs/i18n/useTranslation";

export const subscribeToPushNotification = async () => {
  const { t } = useTranslation();

  const w = window as any;
  await w.workbox.register();
  Notification.requestPermission(async (status) => {
    if (status === "granted") {
      const token = await w.workbox.messageSW({ command: "getFCMToken" });
      if (token) {
        const { success } = await axSaveFCMToken({ token });
        success
          ? notification(t("NOTIFICATIONS.TOKEN_SAVED"), NotificationType.Success)
          : notification(t("NOTIFICATIONS.TOKEN_NOT_SAVED"));
      } else {
        notification(t("NOTIFICATIONS.TOKEN_ERROR"));
      }
    }
  });
};
