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
import { axDeleteObservation } from "@services/observation.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import SimpleButton from "./simple-button";

export default function DeleteObservation({ observationId }) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef();

  const handleOnDelete = async () => {
    const { success } = await axDeleteObservation(observationId);
    if (success) {
      notification(t("OBSERVATION.REMOVE.SUCCESS"), NotificationType.Success);
      onClose();
      router.push("/");
    }
  };

  return (
    <>
      <SimpleButton onClick={onOpen} icon="ibpdelete" title="REMOVE.TITLE" variantColor="red" />
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            ❓ {t("OBSERVATION.REMOVE.TITLE")}
          </AlertDialogHeader>
          <AlertDialogBody>{t("OBSERVATION.REMOVE.DESCRIPTION")}</AlertDialogBody>
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
