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
import useTranslation from "@hooks/use-translation";
import { axDeleteUser } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

export default function DeleteAccount({ userId }) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const router = useLocalRouter();

  const handleOnDelete = async () => {
    const { success } = await axDeleteUser(userId);
    if (success) {
      notification(t("USER.DELETE.SUCCESS"), NotificationType.Success);
      onClose();
      router.push("/user/list");
    }
  };

  return (
    <>
      <Button w="full" colorScheme="red" onClick={onOpen} mb={4}>
        {t("DELETE")}
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("USER.DELETE.TITLE")}
            </AlertDialogHeader>

            <AlertDialogBody>{t("USER.DELETE.MESSAGE")}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {t("CANCEL")}
              </Button>
              <Button colorScheme="red" onClick={handleOnDelete} ml={3}>
                {t("DELETE")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
