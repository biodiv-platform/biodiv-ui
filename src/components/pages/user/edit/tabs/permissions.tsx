import { SimpleGrid, Spinner } from "@chakra-ui/react";
import SelectMultipleInputField from "@components/form/select-multiple";
import SubmitButton from "@components/form/submit-button";
import SwitchField from "@components/form/switch";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { Role } from "@interfaces/user";
import { axGetUserRoles, axUpdateUserPermissions } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { UserEditPageComponentProps } from "..";

export default function PermissionsTab({ user }: UserEditPageComponentProps) {
  const { t } = useTranslation();
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [rolesOptionList, setRoleOptionList] = useState<any[]>([]);

  useEffect(() => {
    axGetUserRoles().then(setRolesList);
  }, []);

  useEffect(() => {
    setRoleOptionList(
      rolesList.map(({ authority, id }) => ({
        label: authority,
        value: id
      }))
    );
  }, [rolesList]);

  const hForm = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object().shape({
        enabled: Yup.boolean().required(),
        accountExpired: Yup.boolean().required(),
        accountLocked: Yup.boolean().required(),
        passwordExpired: Yup.boolean().required(),
        roles: Yup.array().required()
      })
    ),
    defaultValues: {
      enabled: user.enabled,
      accountExpired: user.accountExpired,
      accountLocked: user.accountLocked,
      passwordExpired: user.passwordExpired,
      roles: user.roles?.map(({ id }) => id)
    }
  });

  const handleOnUpdate = async ({ roles, ...payload }) => {
    const { success } = await axUpdateUserPermissions({
      id: user.id,
      roles: rolesList.filter(({ id }) => roles.includes(id)),
      ...payload
    });
    if (success) {
      notification(t("USER.UPDATED"), NotificationType.Success);
    } else {
      notification(t("USER.UPDATE_ERROR"));
    }
  };

  return rolesOptionList.length ? (
    <form onSubmit={hForm.handleSubmit(handleOnUpdate)}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={4}>
        <div>
          <SwitchField name="enabled" label={t("USER.ENABLED")} form={hForm} />
          <SwitchField name="accountExpired" label={t("USER.EXPIRED")} form={hForm} />
          <SwitchField name="accountLocked" label={t("USER.LOCKED")} form={hForm} />
          <SwitchField name="passwordExpired" label={t("USER.PASSWORD_EXPIRED")} form={hForm} />
        </div>
      </SimpleGrid>
      <SelectMultipleInputField
        name="roles"
        label={t("USER.ROLES")}
        options={rolesOptionList}
        form={hForm}
      />
      <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
        {t("SAVE")}
      </SubmitButton>
    </form>
  ) : (
    <Spinner />
  );
}
