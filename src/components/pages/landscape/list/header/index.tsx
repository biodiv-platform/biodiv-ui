import { PageHeading } from "@components/@core/layout";
import useTranslation from "next-translate/useTranslation";

export default function Header() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeading>📍 {t("landscape:title")}</PageHeading>
    </div>
  );
}
