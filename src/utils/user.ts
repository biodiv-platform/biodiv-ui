import { axSaveFCMToken } from "@services/user.service";

export const subscribeToPushNotification = async () => {
  try {
    const workbox = (window as any)?.workbox;

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
  } catch (e) {
    console.debug("Not registering for SW and Push Notifications", e);
  }
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
