import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { PageCreate } from "@interfaces/pages";
import { axCreatePage } from "@services/pages.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import PageForm from "../common/form";

export default function PageCreateForm(): JSX.Element {
  const { t, localeId } = useTranslation();
  const { user, currentGroup } = useGlobalState();

  const defaultValues = {
    content: "",
    parentId: 0,
    sticky: true
  };

  const handleOnPageEdit = async (values) => {
    const payload: PageCreate = {
      ...values,
      description: null,
      userGroupId: currentGroup.id,
      languageId: localeId,
      pageIndex: 0,
      pageType: "CONTENT",
      url: null,
      autherId: user.id,
      autherName: user.name,
      showInFooter: false
    };
    const { success } = await axCreatePage(payload);
    if (success) {
      notification(t("PAGE.CREATE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("PAGE.CREATE.FAILURE"));
    }
  };

  return (
    <PageForm
      defaultValues={defaultValues}
      submitLabel={t("PAGE.CREATE.TITLE")}
      onSubmit={handleOnPageEdit}
    />
  );
}
