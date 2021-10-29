import { createStandaloneToast } from "@chakra-ui/toast";
import { customTheme } from "@configs/theme";
import { isBrowser } from "@static/constants";

import { compiledMessage } from "./basic";

export enum NotificationType {
  Success = "success",
  Info = "info",
  Warning = "warning",
  Error = "error"
}

const notification = (message, type = NotificationType.Error, variables = {}) => {
  if (!message) {
    return;
  }
  if (isBrowser) {
    const toast = createStandaloneToast({ theme: customTheme });

    toast({
      description: typeof message === "string" ? compiledMessage(`${message}`, variables) : message,
      isClosable: true,
      position: "top",
      status: type as any,
      variant: "left-accent"
    });
  }
};

export default notification;
