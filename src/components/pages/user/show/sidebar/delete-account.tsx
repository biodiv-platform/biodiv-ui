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
import { axDeleteUser } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function DeleteAccount({ userId }) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const router = useLocalRouter();

  const handleOnDelete = async () => {
    const { success } = await axDeleteUser(userId);
    if (success) {
      notification(t("user:delete.success"), NotificationType.Success);
      onClose();
      router.push("/user/list");
    }
  };

  return (
    <>
      <Button w="full" colorScheme="red" onClick={onOpen} mb={4}>
        {t("common:delete")}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("user:delete.title")}
            </AlertDialogHeader>

            <AlertDialogBody>{t("user:delete.message")}</AlertDialogBody>

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
