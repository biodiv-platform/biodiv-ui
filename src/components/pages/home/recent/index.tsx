import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import RecentObservationList from "./list";

export default function RecentObservations() {
  const { t } = useTranslation();

  return (
    <Box className="fade" mb={10}>
      <Flex
        justify="space-between"
        align={[null, "center"]}
        direction={["column", "row"]}
        mb={[2, 4]}
      >
        <Heading as="h2" fontSize="2rem">
          {t("home:observations")}
        </Heading>
        <LocalLink href={`/observation/list`} prefixGroup={true}>
          <Link>
            {t("home:more")} <ArrowForwardIcon />
          </Link>
        </LocalLink>
      </Flex>
      <RecentObservationList />
    </Box>
  );
}
