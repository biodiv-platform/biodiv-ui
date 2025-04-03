import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { PhoneNumberInputField } from "@components/form/phone-number";
import { RadioInputField } from "@components/form/radio";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import { axForgotPassword, axRegenerateOTP, axResetPassword } from "@services/auth.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuMoveRight } from "react-icons/lu";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

import { VERIFICATION_TYPE } from "../../register/form/options";

export default function ForgotPasswordComponent() {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const [showMobile, setShowMobile] = useState(false);
  const [user, setUser] = useState<any>();
  const { open, onClose } = useDisclosure({ defaultOpen: true });

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
      notification(t("auth:forgot.reset_success"), NotificationType.Success);
      router.push("/login");
    } else {
      notification(t("auth:otp.messages.error"));
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
        {open ? (
          <>
            <PageHeading>{t("auth:forgot.title")}</PageHeading>
            <FormProvider {...hForm}>
              <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                <div data-hidden={!SITE_CONFIG.REGISTER.MOBILE}>
                  <RadioInputField
                    name="verificationType"
                    label={t("auth:forgot.form.verification_type")}
                    options={VERIFICATION_TYPE}
                    mb={1}
                  />
                </div>
                {showMobile ? (
                  <PhoneNumberInputField name="mobileNumber" label={t("user:mobile")} />
                ) : (
                  <TextBoxField name="email" label={t("user:email")} />
                )}
                <SubmitButton rightIcon={<LuMoveRight />}>
                  {t("auth:forgot.form.submit")}
                </SubmitButton>
              </form>
            </FormProvider>
          </>
        ) : (
          <>
            <PageHeading>{t("auth:otp.title")}</PageHeading>
            <Text mb={4}>
              {t("auth:otp.description")} {user?.vt}
            </Text>
            <FormProvider {...rForm}>
              <form onSubmit={rForm.handleSubmit(handleOnVerification)}>
                <TextBoxField name="otp" label={t("auth:otp.form.otp")} />
                <TextBoxField
                  name="password"
                  label={t("user:password")}
                  type="password"
                  autoComplete="new-password"
                />
                <TextBoxField
                  name="confirmPassword"
                  label={t("user:confirm_password")}
                  type="password"
                  autoComplete="new-password"
                />
                <Flex justifyContent="space-between" alignItems="center">
                  <SubmitButton rightIcon={<LuMoveRight />}>
                    {t("auth:otp.form.submit")}
                  </SubmitButton>
                  <BlueLink onClick={handleRegenerate}>{t("auth:otp.resend")}</BlueLink>
                </Flex>
              </form>
            </FormProvider>
          </>
        )}
      </Box>
    </Flex>
  );
}
