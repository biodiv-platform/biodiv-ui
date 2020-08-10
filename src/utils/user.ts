import { axSaveFCMToken } from "@services/user.service";
import notification, { NotificationType } from "./notification";

export const subscribeToPushNotification = async () => {
  const w = window as any;
  await w.workbox.register();
  Notification.requestPermission(async (status) => {
    if (status === "granted") {
      const token = await w.workbox.messageSW({ command: "getFCMToken" });
      if (token) {
        const { success } = await axSaveFCMToken({ token });
        success
          ? notification("TOKEN_SAVED", NotificationType.Success)
          : notification("TOKEN_NOT_SAVED");
      } else {
        notification("NOTIFICATIONS.TOKEN_ERROR");
      }
    }
  });
};

export const createUserESObject = (user) => {
  const { id, profilePic, name } = user;
  return {
    details: {
      author_id: id,
      activity_score: 0,
      authorName: name,
      profilePic: profilePic != null ? profilePic : ""
    }
  };
};
