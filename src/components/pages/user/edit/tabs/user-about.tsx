import { SimpleGrid } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { PhoneNumberInputField } from "@components/form/phone-number";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { LocationPicker } from "@components/pages/register/form/location";
import {
  GENDER_OPTIONS,
  INSTITUTION_OPTIONS,
  OCCUPATION_OPTIONS
} from "@components/pages/register/form/options";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axUpdateUserAbout } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { UserEditPageComponentProps } from "..";

export default function UserAboutTab({ user, isAdmin }: UserEditPageComponentProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();

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
      notification(t("user:updated"), NotificationType.Success);
      router.push(`/user/show/${user.id}`, true);
    } else {
      notification(t("user:update_error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4}>
          <TextBoxField name="userName" label={t("user:username")} />
          <TextBoxField name="name" label={t("user:name")} />
          <TextBoxField name="email" type="email" disabled={!isAdmin} label={t("user:email")} />
          <PhoneNumberInputField name="mobileNumber" disabled={!isAdmin} label={t("user:mobile")} />
          <SelectInputField
            name="occupation"
            label={t("user:occupation")}
            options={OCCUPATION_OPTIONS}
          />
          <SelectInputField
            name="institution"
            label={t("user:institution")}
            options={INSTITUTION_OPTIONS}
          />
          <SelectInputField name="sexType" label={t("user:gender")} options={GENDER_OPTIONS} />
          <TextBoxField name="website" label={t("user:website")} />
        </SimpleGrid>
        <TextAreaField name="aboutMe" label="About" />
        <LocationPicker />
        <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
