import { Box, Flex, Icon, useDisclosure } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import OTPModal from "@components/auth/otp-modal";
import PhoneNumber from "@components/form/phone-number";
import RadioInput from "@components/form/radio";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { axLoginUG } from "@services/usergroup.service";
import { generateSession } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import { useStoreState } from "easy-peasy";
import useNookies from "next-nookies-persist";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import { VERIFICATION_MODE, VERIFICATION_TYPE } from "../register/form/options";
import Oauth from "./oauth";

interface ISignInFormProps {
  onSuccess?;
  redirect?: boolean;
  forward?: string;
}

function SignInForm({ onSuccess, redirect = true, forward }: ISignInFormProps) {
  const { setNookie } = useNookies();
  const { t } = useTranslation();
  const [user, setUser] = useState();
  const [showMobile, setShowMobile] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { webAddress } = useStoreState((s) => s.currentGroup);

  const hForm = useForm({
    mode: "onBlur",
    validationSchema: Yup.object().shape({
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
    }),
    defaultValues: {
      verificationType: VERIFICATION_TYPE[0].value
    }
  });

  const verificationType = hForm.watch("verificationType");

  useEffect(() => {
    setShowMobile(verificationType === VERIFICATION_TYPE[1].value);
  }, [verificationType]);

  const authSuccessForward = async (tokens) => {
    generateSession(setNookie, tokens, redirect, forward, onSuccess);
  };

  const handleOnSubmit = async (v) => {
    const payload = {
      username: showMobile ? v.mobileNumber : v.email,
      password: v.password,
      mode: v.mode || VERIFICATION_MODE.MANUAL
    };

    const { success, data } = await axLoginUG(payload);

    if (success && data?.status) {
      if (data?.verificationRequired) {
        setUser(data.user);
        onOpen();
      } else {
        authSuccessForward(data);
      }
    } else {
      notification(data?.message || t("NOTIFICATIONS.INVALID_CREDENTIALS"), NotificationType.Error);
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
      <NextSeo title={t("SIGN_IN.TITLE")} />
      <PageHeading>{t("SIGN_IN.TITLE")}</PageHeading>

      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <RadioInput name="verificationType" options={VERIFICATION_TYPE} form={hForm} mb={1} />
        {showMobile ? (
          <PhoneNumber name="mobileNumber" label={t("SIGN_IN.FORM.USERNAME")} form={hForm} />
        ) : (
          <TextBox name="email" label={t("SIGN_IN.FORM.USERNAME")} form={hForm} />
        )}
        <TextBox name="password" type="password" label={t("SIGN_IN.FORM.PASSWORD")} form={hForm} />
        <Flex justifyContent="space-between" alignItems="center">
          <Submit form={hForm} rightIcon="arrow-forward">
            {t("SIGN_IN.FORM.SUBMIT")}
          </Submit>
          <LocalLink href={`${webAddress}/register/forgotPassword`}>
            <BlueLink display="block">{t("SIGN_IN.FORGOT_PASSWORD_LINK")}</BlueLink>
          </LocalLink>
        </Flex>
      </form>
      <Box textAlign="center" color="gray.500" my={4}>
        {t("OR")}
      </Box>

      <Oauth text={t("SIGN_IN.WITH_GOOGLE")} onSuccess={onOAuthSuccess} />

      {t("SIGN_IN.SIGN_UP")}
      <LocalLink href={`${webAddress}/register`}>
        <BlueLink ml={2}>
          {t("SIGN_IN.SIGN_UP_LINK")}
          <Icon name="chevron-right" />
        </BlueLink>
      </LocalLink>

      <OTPModal isOpen={isOpen} onClose={onClose} user={user} />
    </>
  );
}

export default SignInForm;
