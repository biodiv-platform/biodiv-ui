import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import SimpleActionButton from "./simple";

export default function DeleteActionButton({
  observationId,
  deleteFunc,
  title,
  description,
  deleted
}) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef();

  const handleOnDelete = async () => {
    const { success } = await deleteFunc(observationId);
    if (success) {
      notification(deleted, NotificationType.Success);
      onClose();
      router.push("/");
    }
  };

  return (
    <>
      <SimpleActionButton onClick={onOpen} icon="delete" title={title} variantColor="red" />
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            🗑️ {title}
          </AlertDialogHeader>
          <AlertDialogBody>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {t("CANCEL")}
            </Button>
            <Button variantColor="red" onClick={handleOnDelete} ml={3}>
              {t("DELETE")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
