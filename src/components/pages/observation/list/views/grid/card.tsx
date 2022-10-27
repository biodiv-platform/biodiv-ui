import { Badge, Box, Checkbox, Heading, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import ShadowedUser from "@components/pages/common/shadowed-user";
import { ObservationListMinimalData } from "@interfaces/observation";
import { RESOURCE_SIZE } from "@static/constants";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export interface ObservationMinList {
  o: ObservationListMinimalData;
  canEdit: boolean;
  getCheckboxProps?: (props?: any | undefined) => {
    [x: string]: any;
  };
}

export default function GridViewCard({ o, getCheckboxProps, canEdit }: ObservationMinList) {
  const { t } = useTranslation();

  return (
    <Box className="hover-box fade">
      <Box w="full" position="relative" h="16rem">
        {canEdit && getCheckboxProps && (
          <Checkbox
            position="absolute"
            bg="white"
            m={2}
            {...getCheckboxProps({ value: String(o.observationId) })}
          />
        )}
        <LocalLink href={`/observation/show/${o.observationId}`} prefixGroup={true}>
          <Link>
            <Image
              objectFit="cover"
              bg="gray.100"
              w="full"
              h="full"
              borderTopRadius="md"
              src={getResourceThumbnail(
                RESOURCE_CTX.OBSERVATION,
                o?.thumbnail,
                RESOURCE_SIZE.LIST_THUMBNAIL
              )}
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
              <ScientificName value={o.recoIbp?.scientificName || t("common:unknown")} />{" "}
              {!o.recoIbp?.scientificName && (
                <Badge colorScheme="red">{t("observation:help_identify")}</Badge>
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
