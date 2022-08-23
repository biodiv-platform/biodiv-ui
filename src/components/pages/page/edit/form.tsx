import { useLocalRouter } from "@components/@core/local-link";
import { axUpdatePage } from "@services/pages.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { transformPagePayload } from "../common/data";
import PageForm from "../common/form";

interface PageEditFormProps {
  page;
}

export default function PageEditForm({ page }: PageEditFormProps): JSX.Element {
  const { t } = useTranslation();
  const router = useLocalRouter();

  const handleOnPageEdit = async (payload) => {
    const { success } = await axUpdatePage(transformPagePayload(payload, { id: page.id }));

    if (success) {
      notification(t("page:update.success"), NotificationType.Success);
      router.push(`/page/show/${page.id}`, true);
    } else {
      notification(t("page:update.failure"));
    }
  };

  return (
    <PageForm
      defaultValues={page}
      submitLabel={t("page:update.title")}
      onSubmit={handleOnPageEdit}
      hideParentId={true}
    />
  );
}
