import { Button } from "@chakra-ui/core";
import { axSaveFCMToken } from "@services/user.service";
import React from "react";

function SubscribePushButton() {
  const subscribePush = async () => {
    const w = window as any;
    await w.workbox.register();
    Notification.requestPermission(async (status) => {
      if (status === "granted") {
        const token = await w.workbox.messageSW({ command: "getFCMToken" });
        if (token) {
          const { success } = await axSaveFCMToken({ token });
          console.debug(success ? "Token Saved" : "Failed to Save Token");
        } else {
          console.debug("Notification Rejected");
        }
      }
    });
  };

  return <Button onClick={subscribePush}>Subscribe for Push Notifications</Button>;
}

export default SubscribePushButton;
