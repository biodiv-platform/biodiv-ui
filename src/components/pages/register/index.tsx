import { Box, Flex, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuChevronRight } from "react-icons/lu";

import SignUpForm from "./form";

function RegisterComponent() {
  const { t } = useTranslation();

  return (
    <Flex className="container fadeInUp" align="center" justify="center" pt={6}>
      <Box maxW="xl" width="full" pb={6}>
        <NextSeo title={t("user:sign_up")} />
        <PageHeading>{t("user:sign_up")}</PageHeading>
        <Text mb={4}>
          {t("user:existing_user")}{" "}
          <LocalLink href="/login">
            <BlueLink>
              {t("auth:sign_in")}
              <LuChevronRight />
            </BlueLink>
          </LocalLink>
        </Text>
        <SignUpForm />
      </Box>
    </Flex>
  );
}

export default RegisterComponent;
