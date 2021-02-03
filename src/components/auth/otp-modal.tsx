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
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { axRegenerateOTP, axValidateUser } from "@services/auth.service";
import { setCookies } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
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
          <form onSubmit={otpForm.handleSubmit(handleOtpFormSubmit)}>
            <ModalBody pt={8}>
              <Flex direction="column" align="center" mb={8} mt={4}>
                <OTPIcon />
              </Flex>
              <Heading mb={2} size="lg">
                {t("OTP.TITLE")}
              </Heading>
              <Text mb={2} color="gray.600">
                {t("OTP.DESCRIPTION")} {user?.vt}
              </Text>
              <TextBox mb={0} name="otp" label={t("OTP.FORM.OTP")} form={otpForm} />
            </ModalBody>

            <ModalFooter justifyContent="space-between">
              <Link as="button" type="button" onClick={handleRegenerate}>
                {t("OTP.RESEND")}
              </Link>
              <Submit form={otpForm} rightIcon={<ArrowForwardIcon />}>
                {t("OTP.FORM.SUBMIT")}
              </Submit>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
