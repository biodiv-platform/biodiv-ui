import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

import ObservationEditForm from "./form";

export default function ObservationEditComponent(props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="container mt">
        <PageHeading>{t("OBSERVATION.TITLE_EDIT")}</PageHeading>
        <ObservationEditForm {...props} />
      </div>
    </>
  );
}
