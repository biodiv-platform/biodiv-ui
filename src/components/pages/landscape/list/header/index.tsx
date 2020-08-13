import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";

export default function Header() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeading>📍 {t("LANDSCAPE.TITLE")}</PageHeading>
    </div>
  );
}
