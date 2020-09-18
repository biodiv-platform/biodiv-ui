import { Box, Flex, Text } from "@chakra-ui/core";
import { ChevronRightIcon } from "@chakra-ui/icons";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import useGlobalState from "@hooks/useGlobalState";
import { NextSeo } from "next-seo";
import React from "react";

import SignUpForm from "./form";

function RegisterComponent() {
  const { t } = useTranslation();
  const { currentGroup } = useGlobalState();

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xl" width="full" pb={6}>
        <NextSeo title={t("USER.SIGN_UP")} />
        <PageHeading>{t("USER.SIGN_UP")}</PageHeading>
        <Text mb={4}>
          {t("USER.EXISTING_USER")}{" "}
          <LocalLink href={`${currentGroup?.webAddress}/login`}>
            <BlueLink>
              {t("SIGN_IN.TITLE")}
              <ChevronRightIcon />
            </BlueLink>
          </LocalLink>
        </Text>
        <SignUpForm />
      </Box>
    </Flex>
  );
}

export default RegisterComponent;
