import { Button } from "@chakra-ui/core";
import { subscribeToPushNotification } from "@utils/user";
import React from "react";

function SubscribePushButton() {
  const subscribePush = async () => {
    await subscribeToPushNotification();
  };

  return <Button onClick={subscribePush}>Subscribe for Push Notifications</Button>;
}

export default SubscribePushButton;
