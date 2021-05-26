import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { PhoneNumberInputField } from "@components/form/phone-number";
import { RadioInputField } from "@components/form/radio";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import SITE_CONFIG from "@configs/site-config.json";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import { axForgotPassword, axRegenerateOTP, axResetPassword } from "@services/auth.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

import { VERIFICATION_TYPE } from "../../register/form/options";

export default function ForgotPasswordComponent() {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const [showMobile, setShowMobile] = useState(false);
  const [user, setUser] = useState<any>();
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

  const rForm = useForm<any>({
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

  const verificationTypeWatch = hForm.watch("verificationType");

  useEffect(() => {
    setShowMobile(verificationTypeWatch === VERIFICATION_TYPE[1].value);
  }, [verificationTypeWatch]);

  const handleOnSubmit = async ({ verificationType, email, mobileNumber }) => {
    const verificationId = verificationType === VERIFICATION_TYPE[0].value ? email : mobileNumber;
    const { success, data, user } = await axForgotPassword({ verificationId });
    if (success) {
      setUser({ ...user, vt: verificationType.toLowerCase() });
      onClose();
    } else {
      notification(t(data));
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
      notification(t("OTP.MESSAGES.ERROR"));
    }
  };

  const handleRegenerate = async () => {
    const payload = {
      id: user?.id,
      action: 1
    };

    const { success, data } = await axRegenerateOTP(payload);
    notification(t(data), success ? NotificationType.Success : NotificationType.Error);
  };

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xs" width="full" pb={4}>
        {isOpen ? (
          <>
            <PageHeading>{t("FORGOT_PASSWORD.TITLE")}</PageHeading>
            <FormProvider {...hForm}>
              <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                <div data-hidden={!SITE_CONFIG.REGISTER.MOBILE}>
                  <RadioInputField
                    name="verificationType"
                    label={t("FORGOT_PASSWORD.FORM.VERIFICATION_TYPE")}
                    options={VERIFICATION_TYPE}
                    mb={1}
                  />
                </div>
                {showMobile ? (
                  <PhoneNumberInputField name="mobileNumber" label={t("USER.MOBILE")} />
                ) : (
                  <TextBoxField name="email" label={t("USER.EMAIL")} />
                )}
                <SubmitButton rightIcon={<ArrowForwardIcon />}>
                  {t("FORGOT_PASSWORD.FORM.SUBMIT")}
                </SubmitButton>
              </form>
            </FormProvider>
          </>
        ) : (
          <>
            <PageHeading>{t("OTP.TITLE")}</PageHeading>
            <Text mb={4}>
              {t("OTP.DESCRIPTION")} {user?.vt}
            </Text>
            <FormProvider {...hForm}>
              <form onSubmit={rForm.handleSubmit(handleOnVerification)}>
                <TextBoxField name="otp" label={t("OTP.FORM.OTP")} />
                <TextBoxField name="password" label={t("USER.PASSWORD")} type="password" />
                <TextBoxField
                  name="confirmPassword"
                  label={t("USER.CONFIRM_PASSWORD")}
                  type="password"
                />
                <Flex justifyContent="space-between" alignItems="center">
                  <SubmitButton rightIcon={<ArrowForwardIcon />}>
                    {t("OTP.FORM.SUBMIT")}
                  </SubmitButton>
                  <BlueLink onClick={handleRegenerate}>{t("OTP.RESEND")}</BlueLink>
                </Flex>
              </form>
            </FormProvider>
          </>
        )}
      </Box>
    </Flex>
  );
}
