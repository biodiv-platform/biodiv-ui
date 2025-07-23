import { Flex } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuMoveRight } from "react-icons/lu";

export default function ReadMore({ params, dataType }) {
  const { t } = useTranslation();
  return (
    <Flex py={2} justifyContent="flex-end">
      <BlueLink asChild>
        <LocalLink href={`/${dataType}/list`} params={params}>
          {t("common:read_more")} <LuMoveRight />
        </LocalLink>
      </BlueLink>
    </Flex>
  );
}
