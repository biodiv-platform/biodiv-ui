import { ArrowForwardIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import OTPModal from "@components/auth/otp-modal";
import { PhoneNumberInputField } from "@components/form/phone-number";
import { RadioInputField } from "@components/form/radio";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import { axLogin } from "@services/auth.service";
import { forwardRedirect, setCookies } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

import { VERIFICATION_MODE, VERIFICATION_TYPE } from "../register/form/options";
import Oauth from "./oauth";

interface ISignInFormProps {
  onSuccess?;
  redirect?: boolean;
  forward?;
}

function SignInForm({ onSuccess, redirect = true, forward }: ISignInFormProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState();
  const [showMobile, setShowMobile] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

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
          }),
        password: Yup.string().required()
      })
    ),
    defaultValues: {
      verificationType: VERIFICATION_TYPE[0].value
    }
  });

  const verificationType = hForm.watch("verificationType");

  useEffect(() => {
    setShowMobile(verificationType === VERIFICATION_TYPE[1].value);
  }, [verificationType]);

  const authSuccessForward = async (tokens) => {
    setCookies(tokens);
    redirect && forwardRedirect(forward);
    onSuccess && onSuccess();
  };

  const handleOnSubmit = async (v) => {
    const payload = {
      username: showMobile ? v.mobileNumber : v.email,
      password: v.password,
      mode: v.mode || VERIFICATION_MODE.MANUAL
    };

    const { success, data } = await axLogin(payload);

    if (success && data?.status) {
      if (data?.verificationRequired) {
        setUser(data.user);
        onOpen();
      } else {
        authSuccessForward(data);
      }
    } else {
      notification(data?.message || t("notifications.invalid_credentials"), NotificationType.Error);
    }
  };

  const onOAuthSuccess = (r) => {
    handleOnSubmit({
      email: r.profileObj.email,
      password: r.tokenId,
      mode: VERIFICATION_MODE.OAUTH_GOOGLE
    });
  };

  return (
    <>
      <NextSeo title={t("auth:sign_in")} />
      <PageHeading>{t("auth:sign_in")}</PageHeading>

      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <div data-hidden={!SITE_CONFIG.REGISTER.MOBILE}>
            <RadioInputField name="verificationType" options={VERIFICATION_TYPE} mb={1} />
          </div>
          {showMobile ? (
            <PhoneNumberInputField name="mobileNumber" label={t("auth:form.mobile")} />
          ) : (
            <TextBoxField name="email" label={t("auth:form.email")} autoComplete="username" />
          )}
          <TextBoxField
            name="password"
            type="password"
            autoComplete="current-password"
            label={t("auth:form.password")}
          />
          <Flex justifyContent="space-between" alignItems="center">
            <SubmitButton rightIcon={<ArrowForwardIcon />}>{t("auth:form.submit")}</SubmitButton>
            <LocalLink href="/register/forgotPassword">
              <BlueLink display="block">{t("auth:forgot_password_link")}</BlueLink>
            </LocalLink>
          </Flex>
        </form>
      </FormProvider>

      <Box textAlign="center" color="gray.500" my={4}>
        {t("common:or")}
      </Box>

      <Oauth text={t("auth:with_google")} onSuccess={onOAuthSuccess} />

      {t("auth:sign_up")}
      <LocalLink href="/register">
        <BlueLink ml={2}>
          {t("auth:sign_up_link")}
          <ChevronRightIcon />
        </BlueLink>
      </LocalLink>

      <OTPModal isOpen={isOpen} onClose={onClose} user={user} />
    </>
  );
}

export default SignInForm;
