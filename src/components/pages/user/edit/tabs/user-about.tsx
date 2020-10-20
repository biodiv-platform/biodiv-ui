import { SimpleGrid } from "@chakra-ui/core";
import PhoneNumberInputField from "@components/form/phone-number";
import SelectInputField from "@components/form/select";
import SubmitButton from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import LocationPicker from "@components/pages/register/form/location";
import {
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  OCCUPATION_OPTIONS
} from "@components/pages/register/form/options";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axUpdateUserAbout } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { UserEditPageComponentProps } from "..";

export default function UserAboutTab({ user, isAdmin }: UserEditPageComponentProps) {
  const { t } = useTranslation();

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required(),
        userName: Yup.string().required(),
        aboutMe: Yup.string().required(),

        email: Yup.string().nullable(),
        mobileNumber: Yup.string().nullable(),
        sexType: Yup.string().required(),

        occupation: Yup.string().nullable(),
        institution: Yup.string().nullable(),

        latitude: Yup.number().nullable(),
        longitude: Yup.number().nullable(),
        location: Yup.string().required(),

        website: Yup.string().nullable()
      })
    ),
    defaultValues: {
      name: user.name,
      userName: user.userName,
      aboutMe: user?.aboutMe?.trim(),

      email: user.email, // read-only
      mobileNumber: user.mobileNumber, // read-only
      sexType: user.sexType,

      occupation: user.occupation,
      institution: user.institution,

      latitude: user.latitude,
      longitude: user.longitude,
      location: user.location || "",

      website: user.website
    }
  });

  const handleOnUpdate = async (payload) => {
    const { success } = await axUpdateUserAbout({ id: user.id, ...payload });
    if (success) {
      notification(t("USER.UPDATED"), NotificationType.Success);
    } else {
      notification(t("USER.UPDATE_ERROR"));
    }
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4}>
        <TextBoxField name="userName" label={t("USER.USERNAME")} form={hForm} />
        <TextBoxField name="name" label={t("USER.NAME")} form={hForm} />
        <TextBoxField
          name="email"
          type="email"
          disabled={!isAdmin}
          label={t("USER.EMAIL")}
          form={hForm}
        />
        <PhoneNumberInputField
          name="mobileNumber"
          disabled={!isAdmin}
          label={t("USER.MOBILE")}
          form={hForm}
        />
        <SelectInputField
          name="occupation"
          label={t("USER.OCCUPATION")}
          options={OCCUPATION_OPTIONS}
          form={hForm}
        />
        <SelectInputField
          name="institution"
          label={t("USER.INSTITUTION")}
          options={INSTITUTION_OPTIONS}
          form={hForm}
        />
        <SelectInputField
          name="sexType"
          label={t("USER.GENDER")}
          options={GENDER_OPTIONS}
          form={hForm}
        />
        <TextBoxField name="website" label={t("USER.WEBSITE")} form={hForm} />
      </SimpleGrid>
      <TextAreaField name="aboutMe" label="About" form={hForm} />
      <LocationPicker form={hForm} />
      <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
        {t("SAVE")}
      </SubmitButton>
    </form>
  );
}
