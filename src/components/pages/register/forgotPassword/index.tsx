import { Box, Flex, Text, useDisclosure } from "@chakra-ui/core";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import PhoneNumber from "@components/form/phone-number";
import RadioInput from "@components/form/radio";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import useTranslation from "@hooks/use-translation";
import { yupResolver } from "@hookform/resolvers/yup";
import { axForgotPassword, axRegenerateOTP, axResetPassword } from "@services/auth.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

import { VERIFICATION_TYPE } from "../../register/form/options";

export default function ForgotPasswordComponent() {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const [showMobile, setShowMobile] = useState(false);
  const [user, setUser] = useState(null);
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        verificationType: Yup.string().required(),
        email: Yup.string()
          .email()
          .when("verificationType", {
            is: (m) => m === VERIFICATION_TYPE[0].value,
            then: Yup.string().required()
          }),
        mobileNumber: Yup.string()
          .test("mobile", "${path} is not valid", (v) => (v ? isPossiblePhoneNumber(v) : true))
          .when("verificationType", {
            is: (m) => m === VERIFICATION_TYPE[1].value,
            then: Yup.string().required()
          })
      })
    ),
    defaultValues: {
      verificationType: VERIFICATION_TYPE[0].value
    }
  });

  const rForm = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        otp: Yup.string().required(),
        password: Yup.string().min(8).required(),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords do not match")
          .required()
      })
    )
  });

  const verificationType = hForm.watch("verificationType");

  useEffect(() => {
    setShowMobile(verificationType === VERIFICATION_TYPE[1].value);
  }, [verificationType]);

  const handleOnSubmit = async ({ verificationType, email, mobileNumber }) => {
    const verificationId = verificationType === VERIFICATION_TYPE[0].value ? email : mobileNumber;
    const { success, data } = await axForgotPassword({ verificationId });
    if (success) {
      setUser({ ...data?.user, vt: verificationType.toLowerCase() });
      onClose();
    }
  };

  const handleOnVerification = async (values) => {
    const payload = {
      id: user?.id,
      ...values
    };
    const { success } = await axResetPassword(payload);
    if (success) {
      notification(t("FORGOT_PASSWORD.RESET_SUCCESS"), NotificationType.Success);
      router.push("/login");
    } else {
      notification(t("OTP.INVALID_OTP"));
    }
  };

  const handleRegenerate = async () => {
    const { id } = user;

    const payload = {
      id,
      action: 1
    };

    const { success } = await axRegenerateOTP(payload);
    if (success) {
      notification("OTP Resent", NotificationType.Success);
    }
  };

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        {isOpen ? (
          <>
            <PageHeading>{t("FORGOT_PASSWORD.TITLE")}</PageHeading>
            <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
              <RadioInput
                name="verificationType"
                label={t("FORGOT_PASSWORD.FORM.VERIFICATION_TYPE")}
                options={VERIFICATION_TYPE}
                form={hForm}
                mb={1}
              />
              {showMobile ? (
                <PhoneNumber name="mobileNumber" label={t("USER.MOBILE")} form={hForm} />
              ) : (
                <TextBox name="email" label={t("USER.EMAIL")} form={hForm} />
              )}
              <Submit form={hForm} rightIcon={<ArrowForwardIcon />}>
                {t("FORGOT_PASSWORD.FORM.SUBMIT")}
              </Submit>
            </form>
          </>
        ) : (
          <>
            <PageHeading>{t("OTP.TITLE")}</PageHeading>
            <Text mb={4}>
              {t("OTP.DESCRIPTION")} {user?.vt}
            </Text>
            <form onSubmit={rForm.handleSubmit(handleOnVerification)}>
              <TextBox name="otp" label={t("OTP.FORM.OTP")} form={rForm} />
              <TextBox name="password" label={t("USER.PASSWORD")} type="password" form={rForm} />
              <TextBox
                name="confirmPassword"
                label={t("USER.CONFIRM_PASSWORD")}
                type="password"
                form={rForm}
              />
              <Flex justifyContent="space-between" alignItems="center">
                <Submit form={rForm} rightIcon={<ArrowForwardIcon />}>
                  {t("OTP.FORM.SUBMIT")}
                </Submit>
                <BlueLink onClick={handleRegenerate}>{t("OTP.RESEND")}</BlueLink>
              </Flex>
            </form>
          </>
        )}
      </Box>
    </Flex>
  );
}
