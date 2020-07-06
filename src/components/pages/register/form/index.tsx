import { Box, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/core";
import OTPModal from "@components/auth/otp-modal";
import PhoneNumber from "@components/form/phone-number";
import RadioInput from "@components/form/radio";
import Recaptcha from "@components/form/recaptcha";
import Select from "@components/form/select";
import Submit from "@components/form/submit-button";
import TextBox from "@components/form/text";
import Oauth from "@components/pages/login/oauth";
import useTranslation from "@configs/i18n/useTranslation";
import { axCreateUser } from "@services/auth.service";
import { generateSession } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import { useStoreState } from "easy-peasy";
import useNookies from "next-nookies-persist";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import * as Yup from "yup";
import LocationPicker from "./location";
import {
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  PROFESSION_OPTIONS,
  VERIFICATION_MODE,
  VERIFICATION_TYPE
} from "./options";

function SignUpForm() {
  const { setNookie } = useNookies();
  const { t } = useTranslation();
  const [hideVerificationMethod, setHideVerificationMethod] = useState(true);
  const [user, setUser] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure(false);
  const [isOAuth, setIsOAuth] = useState(false);
  const groupId = useStoreState((s) => s?.currentGroup?.id);

  const hForm = useForm({
    mode: "onBlur",
    validationSchema: Yup.object().shape({
      username: Yup.string().required(),
      mobileNumber: Yup.string().test("mobile", "${path} is not valid", (v) =>
        v ? isPossiblePhoneNumber(v) : true
      ),
      email: Yup.string()
        .email()
        .when("mobileNumber", {
          is: (m) => !m,
          then: Yup.string().required("either ${path} or mobile number is required")
        }),
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
    }),
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
    setHideVerificationMethod(watchAuth["email"] && watchAuth["mobileNumber"] ? false : true);
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
        generateSession(setNookie, data, true);
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
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <SimpleGrid columns={[1, 1, 2, 2]} spacingX={4}>
          <Flex hidden={isOAuth} gridColumn="1/3">
            <Oauth text={t("SIGN_UP.FORM.AUTOFILL_WITH_GOOGLE")} onSuccess={onOAuthSuccess} />
          </Flex>
          <TextBox name="username" label={t("SIGN_UP.FORM.USERNAME")} form={hForm} />
          <Select name="gender" label="Gender" options={GENDER_OPTIONS} form={hForm} />

          <TextBox
            name="email"
            type="email"
            disabled={isOAuth}
            label={t("SIGN_UP.FORM.EMAIL")}
            form={hForm}
          />
          <PhoneNumber name="mobileNumber" label={t("SIGN_UP.FORM.MOBILE")} form={hForm} />
          <Box style={{ gridColumn: "1/3" }} hidden={hideVerificationMethod}>
            <RadioInput
              mb={1}
              name="verificationType"
              label={t("SIGN_UP.FORM.VERIFY_THROUGH")}
              options={VERIFICATION_TYPE}
              form={hForm}
            />
          </Box>

          <TextBox
            name="password"
            type="password"
            label={t("SIGN_UP.FORM.PASSWORD")}
            form={hForm}
            hidden={isOAuth}
          />
          <TextBox
            name="confirmPassword"
            type="password"
            label={t("SIGN_UP.FORM.CONFIRM_PASSWORD")}
            form={hForm}
            hidden={isOAuth}
          />

          <Select name="profession" label="Profession" options={PROFESSION_OPTIONS} form={hForm} />
          <Select
            name="institution"
            label="Institution"
            options={INSTITUTION_OPTIONS}
            form={hForm}
          />
        </SimpleGrid>
        <LocationPicker form={hForm} />
        <Recaptcha name="recaptcha" form={hForm} />
        <Submit form={hForm} rightIcon="arrow-forward" w="full">
          {t("SIGN_UP.FORM.SUBMIT")}
        </Submit>
      </form>
      <OTPModal isOpen={isOpen} onClose={onClose} user={user} />
    </>
  );
}

export default SignUpForm;
