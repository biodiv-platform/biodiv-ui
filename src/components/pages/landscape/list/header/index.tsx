import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Header() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeading>📍 {t("landscape:title")}</PageHeading>
    </div>
  );
}
