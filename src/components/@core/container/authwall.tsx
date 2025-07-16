import { Spinner, useDisclosure } from "@chakra-ui/react";
import { AUTHWALL } from "@static/events";
import React, { Suspense, useState } from "react";
import { emit, useListener } from "react-gbus";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

const SignInForm = React.lazy(() => import("@components/pages/login/form"));

export default function AuthWall() {
  const { open, onOpen, onClose } = useDisclosure();
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
    <DialogRoot open={open} onOpenChange={handleOnFailure}>
      <DialogBackdrop className="fade">
        <DialogContent className="fadeInUp" borderRadius="md">
          <DialogHeader>Auth Wall</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            <Suspense fallback={<Spinner />}>
              <SignInForm onSuccess={handleOnSuccess} redirect={false} />
            </Suspense>
          </DialogBody>
        </DialogContent>
      </DialogBackdrop>
    </DialogRoot>
  );
}
