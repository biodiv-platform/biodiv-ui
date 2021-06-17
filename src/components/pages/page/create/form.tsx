import { useLocalRouter } from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import { PageCreate } from "@interfaces/pages";
import { axCreatePage } from "@services/pages.service";
import { dateToUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import PageForm from "../common/form";

export default function PageCreateForm(): JSX.Element {
  const { t } = useTranslation();
  const { user, currentGroup, languageId } = useGlobalState();
  const router = useLocalRouter();

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
      languageId,
      pageIndex: 0,
      pageType: "Content",
      url: null,
      autherId: user?.id,
      autherName: user?.name,
      showInFooter: false,
      date: dateToUTC().format()
    };
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
