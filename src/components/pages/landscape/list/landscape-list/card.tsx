import { Box, Heading, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { Landscape } from "@interfaces/landscape";
import { ENDPOINT } from "@static/constants";
import { OBSERVATION_FALLBACK } from "@static/inline-images";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function GridViewCard({ o }: { o: Landscape }) {
  const { t } = useTranslation();

  return (
    <Box className="hover-box fade">
      <Box w="full" position="relative" h="14rem">
        <LocalLink href={`/landscape/show/${o.id}`} prefixGroup={true}>
          <Link>
            <Image
              objectFit="contain"
              p={3}
              bg="white"
              w="full"
              h="full"
              src={`${ENDPOINT.GEOENTITIES}/v1/services/image/${o.geoEntityId}`}
              fallbackSrc={OBSERVATION_FALLBACK.PHOTO}
              alt={o?.shortName?.toString()}
            />
          </Link>
        </LocalLink>
      </Box>
      <LocalLink href={`/observation/show/${o.id}`} prefixGroup={true}>
        <Link textDecoration="none!important">
          <Box h="4.6rem" p={4} bg="gray.100">
            <Text color="gray.600" mb={1} fontSize="xs">
              {t("landscape:site_number")}
              {o.siteNumber}
            </Text>
            <Heading size="sm" className="elipsis" title={o.shortName}>
              {o.shortName}
            </Heading>
          </Box>
        </Link>
      </LocalLink>
    </Box>
  );
}
