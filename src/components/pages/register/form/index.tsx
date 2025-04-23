import { Box, GridItem, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import OTPModal from "@components/auth/otp-modal";
import { CheckboxField } from "@components/form/checkbox";
import { PhoneNumberInputField } from "@components/form/phone-number";
import { RadioInputField } from "@components/form/radio";
import { RecaptchaField } from "@components/form/recaptcha";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import Oauth from "@components/pages/login/oauth";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import { axCreateUser } from "@services/auth.service";
import { INVALID_COORDINATE } from "@static/constants";
import { forwardRedirect, setCookies } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuMoveRight } from "react-icons/lu";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";

import { toaster } from "@/components/ui/toaster";

import { LocationPicker } from "./location";
import {
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  OCCUPATION_OPTIONS,
  VERIFICATION_MODE,
  VERIFICATION_TYPE
} from "./options";

interface Payload {
  credentials: {
    username?: string;
    mobileNumber?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
    profession?: string | null;
    institution?: string | null;
    latitude?: number;
    longitude?: number;
    location?: string;
    verificationType?: string;
    mode?: string;
    terms?: boolean;
    recaptcha?: string;
  };
  groupId?: number;
}

function SignUpForm() {
  const { t } = useTranslation();
  const [hideVerificationMethod, setHideVerificationMethod] = useState(true);
  const [user, setUser] = useState(null);
  const { open, onClose, onOpen } = useDisclosure();
  const [isOAuth, setIsOAuth] = useState(false);
  const {
    currentGroup: { id: groupId }
  } = useGlobalState();

  // const toast = useToast();

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
                then: Yup.string().required(t("user:email_or_mobile_required"))
              })
          : Yup.string().email().required(),
        password: Yup.string().min(8).required(),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], t("user:passwords_not_match"))
          .required(),
        gender: Yup.string().required(),
        profession: Yup.string().nullable(),
        institution: Yup.string().nullable(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        location: Yup.string().required(),
        verificationType: Yup.string().required(),
        mode: Yup.string(),
        terms: Yup.boolean().oneOf([true], t("user:terms.required")),
        recaptcha: Yup.string().required()
      })
    ),
    defaultValues: {
      verificationType: VERIFICATION_TYPE[0].value,
      mode: VERIFICATION_MODE.MANUAL,
      terms: true
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

  const handleOnSubmit = async ({ terms, ...v }) => {
    const verificationType =
      v.email && v.mobileNumber ? v.verificationType : VERIFICATION_TYPE[v.email ? 0 : 1].value;

    const payload: Payload = {
      credentials: { ...v, verificationType },
      groupId
    };

    const { latitude, longitude } = payload.credentials;

    if (latitude == INVALID_COORDINATE.LATITUDE || longitude == INVALID_COORDINATE.LONGITUDE) {
      toaster.create({
        title: "Invalid coordinates",
        description: "please select location from google suggestions only",
        type: "error",
        duration: 5000,
        closable: true
      });
      return;
    }

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
          <SimpleGrid columns={{ base: 1, md: 2 }} gapX={4}>
            <GridItem colSpan={{ md: 2 }} hidden={isOAuth}>
              <Oauth text={t("user:autofill_with_google")} onSuccess={onOAuthSuccess} />
            </GridItem>
            <TextBoxField name="username" label={t("user:name")} />
            <SelectInputField
              name="gender"
              label={t("user:gender")}
              options={GENDER_OPTIONS}
              shouldPortal={true}
            />

            <TextBoxField name="email" type="email" disabled={isOAuth} label={t("user:email")} />
            <PhoneNumberInputField name="mobileNumber" label={t("user:mobile")} />
            <Box style={{ gridColumn: "1/3" }} hidden={hideVerificationMethod}>
              <RadioInputField
                mb={1}
                name="verificationType"
                label={t("user:verify_through")}
                options={VERIFICATION_TYPE}
              />
            </Box>

            <TextBoxField
              name="password"
              type="password"
              label={t("user:password")}
              autoComplete="new-password"
              hidden={isOAuth}
            />
            <TextBoxField
              name="confirmPassword"
              type="password"
              label={t("user:confirm_password")}
              autoComplete="new-password"
              hidden={isOAuth}
            />

            <SelectInputField
              name="profession"
              label={t("user:occupation")}
              options={OCCUPATION_OPTIONS}
              shouldPortal={true}
            />
            <SelectInputField
              name="institution"
              label={t("user:institution")}
              options={INSTITUTION_OPTIONS}
              shouldPortal={true}
            />
          </SimpleGrid>
          <LocationPicker />
          <RecaptchaField name="recaptcha" />
          <Box mt={4}>
            <CheckboxField name="terms" label="terms">
              {t("user:terms.text")}
              <ExternalBlueLink
                mx={1}
                href={SITE_CONFIG.PAGES.TERMS}
                children={t("user:terms.terms")}
              />
              {t("common:and")}
              <ExternalBlueLink
                mx={1}
                href={SITE_CONFIG.PAGES.PRIVACY}
                children={t("user:terms.privacy")}
              />
            </CheckboxField>
          </Box>
          <SubmitButton rightIcon={<LuMoveRight />} w="full">
            {t("user:register")}
          </SubmitButton>
        </form>
      </FormProvider>
      <OTPModal isOpen={open} onClose={onClose} user={user} />
    </>
  );
}

export default SignUpForm;
