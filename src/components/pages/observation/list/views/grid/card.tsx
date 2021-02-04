import { Badge, Box, Heading, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import { ObservationListMinimalData } from "@interfaces/observation";
import { RESOURCE_SIZE } from "@static/constants";
import { getObservationImage, getLocalIcon } from "@utils/media";
import React from "react";

import ShadowedUser from "@components/pages/common/shadowed-user";

export default function GridViewCard({ o }: { o: ObservationListMinimalData }) {
  const { t } = useTranslation();

  return (
    <Box className="hover-box fade">
      <Box w="full" position="relative" h="16rem">
        <LocalLink href={`/observation/show/${o.observationId}`} prefixGroup={true}>
          <Link>
            <Image
              objectFit="cover"
              bg="gray.100"
              w="full"
              h="full"
              src={getObservationImage(o?.thumbnail, RESOURCE_SIZE.LIST_THUMBNAIL)}
              fallbackSrc={getLocalIcon(o?.speciesGroup)}
              alt={o.observationId?.toString()}
            />
          </Link>
        </LocalLink>
        <ShadowedUser user={o?.user} />
      </Box>
      <LocalLink href={`/observation/show/${o.observationId}`} prefixGroup={true}>
        <Link textDecoration="none!important">
          <Box h="4.6rem" p={4}>
            <Heading size="sm" className="elipsis" title={o.recoIbp?.commonName}>
              {o.recoIbp?.scientificName || t("OBSERVATION.UNKNOWN")}{" "}
              {!o.recoIbp?.scientificName && (
                <Badge colorScheme="red">{t("OBSERVATION.HELP_IDENTIFY")}</Badge>
              )}
            </Heading>

            <Text color="gray.600" mt={1} fontSize="sm" title={o.recoIbp?.commonName}>
              {o.recoIbp?.commonName}
            </Text>
          </Box>
        </Link>
      </LocalLink>
    </Box>
  );
}
