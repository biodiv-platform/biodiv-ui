import { axSaveFCMToken } from "@services/user.service";

export const subscribeToPushNotification = async () => {
  const workbox = (window as any)?.workbox;
  if (!workbox) {
    console.debug("Not registering for Push Notifications");
    return;
  }

  await workbox.register();
  Notification.requestPermission(async (status) => {
    if (status === "granted") {
      const token = await workbox.messageSW({ command: "getFCMToken" });
      if (token) {
        const { success } = await axSaveFCMToken({ token });
        console.debug(success ? "TOKEN_SAVED" : "TOKEN_NOT_SAVED");
      } else {
        console.debug("NOTIFICATIONS.TOKEN_ERROR");
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
