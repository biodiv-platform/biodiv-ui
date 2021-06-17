import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ObservationEditForm from "./form";

export default function ObservationEditComponent(props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="container mt">
        <PageHeading>{t("observation:title_edit")}</PageHeading>
        <ObservationEditForm {...props} />
      </div>
    </>
  );
}
