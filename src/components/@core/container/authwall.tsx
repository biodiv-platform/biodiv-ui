import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure
} from "@chakra-ui/react";
import SignInForm from "@components/pages/login/form";
import { AUTHWALL } from "@static/events";
import React, { Suspense, useState } from "react";
import { emit, useListener } from "react-gbus";

export default function AuthWall() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [callback, setCallback] = useState<any>(null);

  useListener(
    (r) => {
      onOpen();
      setCallback(r);
    },
    [AUTHWALL.INIT]
  );

  const handleOnSuccess = (user) => {
    onClose();
    emit(AUTHWALL.SUCCESS, user);
    callback.resolve(user);
  };

  const handleOnFailure = () => {
    onClose();
    emit(AUTHWALL.FAILURE);
    callback.reject({ message: null });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnFailure}>
      <ModalOverlay className="fade">
        <ModalContent className="fadeInUp" borderRadius="md">
          <ModalHeader>Auth Wall</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Suspense fallback={<Spinner />}>
              <SignInForm onSuccess={handleOnSuccess} redirect={false} />
            </Suspense>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
