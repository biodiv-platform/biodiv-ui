import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { useGroupDelete } from "@components/pages/group/edit/use-group-delete";
import DeleteIcon from "@icons/delete";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import SimpleActionButton from "./simple";

export default function DeleteActionButton({
  observationId,
  deleteFunc,
  title,
  deleteGnfinderName = false,
  description,
  deleted,
  deleteComment = false,
  deleteUserGroup = false,
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
  const { isOpen, onClose, onOpen } = useDisclosure();
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
          if (deleteUserGroup) {
            const { axUnpostUserGroupObservations, axUnpostUserGroupSpecies } = useGroupDelete();
            await axUnpostUserGroupObservations(observationId);
            await axUnpostUserGroupSpecies(observationId);
            router.push("/", false);
          } else {
            router.push("/", true);
          }
        }
      }
    }
  };

  return (
    <>
      <SimpleActionButton onClick={onOpen} icon={<DeleteIcon />} title={title} colorScheme="red" />
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              🗑️ {title}
            </AlertDialogHeader>

            <AlertDialogBody>{description}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("common:cancel")}
              </Button>
              <Button colorScheme="red" onClick={handleOnDelete} ml={3}>
                {t("common:delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
