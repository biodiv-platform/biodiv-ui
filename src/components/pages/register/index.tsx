import { Box, Flex, Icon, Text } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import { useStoreState } from "easy-peasy";
import { NextSeo } from "next-seo";
import React from "react";

import SignUpForm from "./form";

function RegisterComponent() {
  const { t } = useTranslation();
  const { webAddress } = useStoreState((s) => s.currentGroup);

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xl" width="full" pb={6}>
        <NextSeo title={t("SIGN_UP.TITLE")} />
        <PageHeading>{t("SIGN_UP.TITLE")}</PageHeading>
        <Text mb={4}>
          {t("SIGN_UP.EXISTING_USER")}{" "}
          <LocalLink href={`${webAddress}/login`}>
            <BlueLink>
              {t("SIGN_IN.TITLE")}
              <Icon name="chevron-right" />
            </BlueLink>
          </LocalLink>
        </Text>
        <SignUpForm />
      </Box>
    </Flex>
  );
}

export default RegisterComponent;
