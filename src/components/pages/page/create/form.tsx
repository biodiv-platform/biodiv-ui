import { useLocalRouter } from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import { PageCreate } from "@interfaces/pages";
import { axCreatePage } from "@services/pages.service";
import { dateToUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

import PageForm from "../common/form";

export default function PageCreateForm(): JSX.Element {
  const { t, localeId } = useTranslation();
  const { user, currentGroup } = useGlobalState();
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
      languageId: localeId,
      pageIndex: 0,
      pageType: "Content",
      url: null,
      autherId: user.id,
      autherName: user.name,
      showInFooter: false,
      date: dateToUTC().format()
    };
    const { success, data } = await axCreatePage(payload);
    if (success) {
      notification(t("PAGE.CREATE.SUCCESS"), NotificationType.Success);
      router.push(`/page/show/${data?.id}`, true);
    } else {
      notification(t("PAGE.CREATE.FAILURE"));
    }
  };

  return (
    <PageForm
      defaultValues={defaultValues}
      submitLabel={t("PAGE.CREATE.TITLE")}
      onSubmit={handleOnPageEdit}
      hideParentId={false}
    />
  );
}
