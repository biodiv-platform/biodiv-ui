import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function ReadMore({ params, dataType }) {
  const { t } = useTranslation();
  return (
    <Flex py={2} justifyContent="flex-end">
      <LocalLink href={`/${dataType}/list`} params={params}>
        <BlueLink>
          {t("common:read_more")} <ArrowForwardIcon />
        </BlueLink>
      </LocalLink>
    </Flex>
  );
}
