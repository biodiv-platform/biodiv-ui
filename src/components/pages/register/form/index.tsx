import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import OTPModal from "@components/auth/otp-modal";
import { PhoneNumberInputField } from "@components/form/phone-number";
import { RadioInputField } from "@components/form/radio";
import { RecaptchaField } from "@components/form/recaptcha";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import Oauth from "@components/pages/login/oauth";
import SITE_CONFIG from "@configs/site-config.json";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { axCreateUser } from "@services/auth.service";
import { forwardRedirect, setCookies } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

import { LocationPicker } from "./location";
import {
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  OCCUPATION_OPTIONS,
  VERIFICATION_MODE,
  VERIFICATION_TYPE
} from "./options";

function SignUpForm() {
  const { t } = useTranslation();
  const [hideVerificationMethod, setHideVerificationMethod] = useState(true);
  const [user, setUser] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isOAuth, setIsOAuth] = useState(false);
  const {
    currentGroup: { id: groupId }
  } = useGlobalState();

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        username: Yup.string().required(),
        mobileNumber: Yup.string().test("mobile", "${path} is not valid", (v) =>
          v ? isPossiblePhoneNumber(v) : true
        ),
        email: SITE_CONFIG.REGISTER.MOBILE
          ? Yup.string()
              .email()
              .when("mobileNumber", {
                is: (m) => !m,
                then: Yup.string().required("either ${path} or mobile number is required")
              })
          : Yup.string().email().required(),
        password: Yup.string().min(8).required(),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords do not match")
          .required(),
        gender: Yup.string().required(),
        profession: Yup.string().nullable(),
        institution: Yup.string().nullable(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        location: Yup.string().required(),
        verificationType: Yup.string().required(),
        mode: Yup.string(),
        recaptcha: Yup.string().required()
      })
    ),
    defaultValues: {
      verificationType: VERIFICATION_TYPE[0].value,
      mode: VERIFICATION_MODE.MANUAL
    }
  });

  const watchAuth = hForm.watch(["email", "mobileNumber"]);

  useEffect(() => {
    hForm.register("mode");
  }, []);

  useEffect(() => {
    if (SITE_CONFIG.REGISTER.MOBILE) {
      setHideVerificationMethod(watchAuth["email"] && watchAuth["mobileNumber"] ? false : true);
    }
  }, [watchAuth]);

  const handleOnSubmit = async (v) => {
    const verificationType =
      v.email && v.mobileNumber ? v.verificationType : VERIFICATION_TYPE[v.email ? 0 : 1].value;
    const payload = {
      credentials: {
        ...v,
        verificationType
      },
      groupId
    };
    const { success, data } = await axCreateUser(payload);
    if (success && data?.status) {
      if (data?.verificationRequired) {
        setUser({ ...data?.user, vt: v.verificationType });
        onOpen();
      } else {
        setCookies(data);
        forwardRedirect();
      }
    } else {
      notification(data?.message, NotificationType.Info);
    }
  };

  const onOAuthSuccess = (r) => {
    hForm.setValue("username", r.profileObj.name);
    hForm.setValue("email", r.profileObj.email);
    hForm.setValue("mode", VERIFICATION_MODE.OAUTH_GOOGLE);
    hForm.setValue("password", r.tokenId);
    hForm.setValue("confirmPassword", r.tokenId);
    setIsOAuth(true);
  };

  return (
    <>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <SimpleGrid columns={[1, 1, 2, 2]} spacingX={4}>
            <Flex hidden={isOAuth} gridColumn="1/3">
              <Oauth text={t("USER.AUTOFILL_WITH_GOOGLE")} onSuccess={onOAuthSuccess} />
            </Flex>
            <TextBoxField name="username" label={t("USER.NAME")} />
            <SelectInputField
              name="gender"
              label="Gender"
              options={GENDER_OPTIONS}
              shouldPortal={true}
            />

            <TextBoxField name="email" type="email" disabled={isOAuth} label={t("USER.EMAIL")} />
            <PhoneNumberInputField name="mobileNumber" label={t("USER.MOBILE")} />
            <Box style={{ gridColumn: "1/3" }} hidden={hideVerificationMethod}>
              <RadioInputField
                mb={1}
                name="verificationType"
                label={t("USER.VERIFY_THROUGH")}
                options={VERIFICATION_TYPE}
              />
            </Box>

            <TextBoxField
              name="password"
              type="password"
              label={t("USER.PASSWORD")}
              autoComplete="new-password"
              hidden={isOAuth}
            />
            <TextBoxField
              name="confirmPassword"
              type="password"
              label={t("USER.CONFIRM_PASSWORD")}
              autoComplete="new-password"
              hidden={isOAuth}
            />

            <SelectInputField
              name="profession"
              label="Profession"
              options={OCCUPATION_OPTIONS}
              shouldPortal={true}
            />
            <SelectInputField
              name="institution"
              label="Institution"
              options={INSTITUTION_OPTIONS}
              shouldPortal={true}
            />
          </SimpleGrid>
          <LocationPicker />
          <RecaptchaField name="recaptcha" />
          <SubmitButton rightIcon={<ArrowForwardIcon />} w="full">
            {t("USER.REGISTER")}
          </SubmitButton>
        </form>
      </FormProvider>
      <OTPModal isOpen={isOpen} onClose={onClose} user={user} />
    </>
  );
}

export default SignUpForm;
