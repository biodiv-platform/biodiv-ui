import { PageHeading } from "@components/@core/layout";
import useTranslation from "@hooks/use-translation";
import React from "react";

export default function Header() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeading>🐾 {t("SPECIES.LIST.TITLE")}</PageHeading>
    </div>
  );
}
