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
import DeleteIcon from "@icons/delete";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import SimpleActionButton from "./simple";

export default function DeleteActionButton({
  observationId,
  deleteFunc,
  title,
  description,
  deleteGnfinderName,
  refreshgnfinderNameFunc,
  deleted
}) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const cancelRef = React.useRef(null);

  const handleOnDelete = async () => {
    
    console.log("deleteGnfinderName=",deleteGnfinderName)
    console.log("refreshgnfinderNameFunc",refreshgnfinderNameFunc)
    
    
    const { success } = await deleteFunc(observationId);
    if (success) {
     
      notification(deleted, NotificationType.Success);
      onClose();
      if(deleteGnfinderName){
        refreshgnfinderNameFunc
      }
      /* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
      console.log("value of onclose is = ",onClose);
      if(!deleteGnfinderName){
        router.push("/", true);
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
