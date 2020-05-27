import useTranslation from "@configs/i18n/useTranslation";
import React from "react";
import { RWebShare } from "react-web-share";

import SimpleButton from "./simple-button";

export default function Share({ text }) {
  const { t } = useTranslation();
  return (
    <RWebShare
      data={{
        text,
        title: t("OBSERVATION.SHARE")
      }}
    >
      <SimpleButton icon="ibpshare" title="SHARE" variantColor="orange" />
    </RWebShare>
  );
}
