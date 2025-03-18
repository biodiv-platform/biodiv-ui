import { isBrowser } from "@static/constants";

import { toaster } from "@/components/ui/toaster";

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
    toaster.create({
      description: typeof message === "string" ? compiledMessage(`${message}`, variables) : message,
      type: type
    });
  }
};

export default notification;
