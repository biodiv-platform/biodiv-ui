import { Button, useDisclosure } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import DeleteIcon from "@icons/delete";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import SimpleActionButton from "./simple";

export default function DeleteActionButton({
  observationId,
  deleteFunc,
  title,
  deleteGnfinderName = false,
  description,
  deleted,
  deleteComment = false,
  commentDeletePayload = {},
  refreshFunc = () => {
    return null;
  },

  refreshActivity = (): Promise<void> => {
    return Promise.resolve();
  }
}) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { open, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef(null);

  const handleOnDelete = async () => {
    if (deleteComment) {
      // add AJAX call for deleting the comment

      const { success } = await deleteFunc(observationId, commentDeletePayload);

      if (success) {
        notification(deleted, NotificationType.Success);
        refreshActivity();
      } else {
        notification("comment could not be removed", NotificationType.Error);
      }
    } else {
      const { success } = await deleteFunc(observationId);
      if (success) {
        notification(deleted, NotificationType.Success);
        if (deleteGnfinderName) {
          refreshFunc();
        }
        onClose();
        if (!deleteGnfinderName) {
          router.push("/", true);
        }
      }
    }
  };

  return (
    <>
      <SimpleActionButton onClick={onOpen} icon={<DeleteIcon />} title={title} colorPalette="red" />
      <DialogRoot open={open} onOpenChange={onClose}>
        <DialogBackdrop>
          <DialogContent>
            <DialogHeader fontSize="lg" fontWeight="bold">
              🗑️ {title}
            </DialogHeader>

            <DialogBody>{description}</DialogBody>

            <DialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("common:cancel")}
              </Button>
              <Button colorPalette="red" onClick={handleOnDelete} ml={3}>
                {t("common:delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogBackdrop>
      </DialogRoot>
    </>
  );
}
