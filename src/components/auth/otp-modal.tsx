import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import { axRegenerateOTP, axValidateUser } from "@services/auth.service";
import { setCookies } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import OTPIcon from "./otp-icon";

export default function OTPModal({ isOpen, onClose, user }) {
  const { t } = useTranslation();
  const router = useLocalRouter();

  const otpForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        otp: Yup.string().required()
      })
    )
  });

  const handleOtpFormSubmit = async (values) => {
    const { success, data, message } = await axValidateUser({
      id: user.id,
      otp: values.otp
    });

    if (success) {
      setCookies(data);
      router.push("/");
      notification(t(message), NotificationType.Success);
    } else {
      notification(t(message));
    }
  };

  const handleRegenerate = async () => {
    const { id } = user;

    const payload = {
      id,
      action: 0
    };

    const { success, data } = await axRegenerateOTP(payload);
    notification(t(data), success ? NotificationType.Success : NotificationType.Error);
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay className="fade">
        <ModalContent className="fadeInUp" borderRadius="md">
          <ModalCloseButton />
          <FormProvider {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpFormSubmit)}>
              <ModalBody pt={8}>
                <Flex direction="column" align="center" mb={8} mt={4}>
                  <OTPIcon />
                </Flex>
                <Heading mb={2} size="lg">
                  {t("auth:otp.title")}
                </Heading>
                <Text mb={2} color="gray.600">
                  {t("auth:otp.description")} {user?.vt}
                </Text>
                <TextBoxField mb={0} name="otp" label={t("auth:otp.form.otp")} />
              </ModalBody>

              <ModalFooter justifyContent="space-between">
                <Link as="button" type="button" onClick={handleRegenerate}>
                  {t("auth:otp.resend")}
                </Link>
                <SubmitButton rightIcon={<ArrowForwardIcon />}>
                  {t("auth:otp.form.submit")}
                </SubmitButton>
              </ModalFooter>
            </form>
          </FormProvider>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
