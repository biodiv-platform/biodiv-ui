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
} from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { axGetUser, axRegenerateOTP, axValidateUser } from "@services/auth.service";
import { TOKEN } from "@static/constants";
import notification, { NotificationType } from "@utils/notification";
import useNookies from "next-nookies-persist";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import OTPIcon from "./otp-icon";

export default function OTPModal({ isOpen, onClose, user }) {
  const { setNookie } = useNookies();
  const { t } = useTranslation();
  const router = useLocalRouter();

  const otpForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      otp: Yup.string().required()
    })
  });

  const handleOtpFormSubmit = async (values) => {
    const { otp } = values;
    const { id } = user;

    const payload = {
      id,
      otp
    };

    const { success: s1, data: tokens } = await axValidateUser(payload);
    if (s1) {
      setNookie(TOKEN.AUTH, tokens);
      const { success: s2, data: userData } = await axGetUser();
      if (s2) {
        setNookie(TOKEN.USER, userData);
        router.push("/");
      }
      notification(tokens?.message, NotificationType.Success);
    }
  };

  const handleRegenerate = async () => {
    const { id } = user;

    const payload = {
      id,
      action: 0
    };

    const { success } = await axRegenerateOTP(payload);
    if (success) {
      notification("OTP Resent", NotificationType.Success);
    }
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay className="fade" />
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
            <Submit form={otpForm} rightIcon="arrow-forward">
              {t("OTP.FORM.SUBMIT")}
            </Submit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
