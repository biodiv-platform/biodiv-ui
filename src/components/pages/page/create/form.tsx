import { useLocalRouter } from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import { axCreatePage } from "@services/pages.service";
import { dateToUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { PAGE_TYPE_OPTIONS, transformPagePayload } from "../common/data";
import PageForm from "../common/form";

const defaultValues = {
  content: "",
  description: null,
  url: null,
  pageType: PAGE_TYPE_OPTIONS[0].value
};

export default function PageCreateForm(): JSX.Element {
  const { t } = useTranslation();
  const { user, currentGroup, languageId } = useGlobalState();
  const router = useLocalRouter();

  const handleOnPageEdit = async (values) => {
    const payload = transformPagePayload(values, {
      date: dateToUTC().format(),
      parentId: 0,
      sticky: true,
      pageIndex: 0,
      showInFooter: false,
      userGroupId: currentGroup.id,
      languageId,
      autherId: user?.id,
      autherName: user?.name
    });
    const { success, data } = await axCreatePage(payload);
    if (success) {
      notification(t("page:create.success"), NotificationType.Success);
      router.push(`/page/show/${data?.id}`, true);
    } else {
      notification(t("page:create.failure"));
    }
  };

  return (
    <PageForm
      defaultValues={defaultValues}
      submitLabel={t("page:create.title")}
      onSubmit={handleOnPageEdit}
      hideParentId={false}
    />
  );
}
