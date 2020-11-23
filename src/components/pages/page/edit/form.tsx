import useTranslation from "@hooks/use-translation";
import { axUpdatePage } from "@services/pages.service";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import PageForm from "../common/form";

interface PageEditFormProps {
  page;
}

export default function PageEditForm({ page }: PageEditFormProps): JSX.Element {
  const { t } = useTranslation();

  const defaultValues = {
    title: page.title,
    content: page.content,
    sticky: page.sticky,
    parentId: page.parentId
  };

  const handleOnPageEdit = async (payload) => {
    const { success } = await axUpdatePage({
      id: page.id,
      pageType: page.pageType,
      url: page.url,
      showInFooter: page.showInFooter,
      ...payload
    });
    if (success) {
      notification(t("PAGE.UPDATE.SUCCESS"), NotificationType.Success);
    } else {
      notification(t("PAGE.UPDATE.FAILURE"));
    }
  };

  return (
    <PageForm
      defaultValues={defaultValues}
      submitLabel={t("PAGE.UPDATE.TITLE")}
      onSubmit={handleOnPageEdit}
    />
  );
}
