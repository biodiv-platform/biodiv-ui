import { AspectRatio, Badge, Box, Heading, Image, Link, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import useGlobalState from "@hooks/use-global-state";
import { AssetStatus } from "@interfaces/custom";
import { getFallbackByMIME } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { getImageThumb } from "../../create/form/uploader/observation-resources/resource-card";

const ASSET_STATUS = {
  [AssetStatus.InProgress]: { colorScheme: "orange", text: "observation:status.in_progress" },
  [AssetStatus.Uploaded]: { colorScheme: "green", text: "observation:status.uploaded" },
  [AssetStatus.Failed]: { colorScheme: "red", text: "observation:status.failed" }
};
export default function ProgressCard({ item }) {
  const { user } = useGlobalState();
  const { t } = useTranslation();

  return (
    <Box position="relative" className="white-box fade" flex="0 0 250px">
      <LocalLink href={`/observation/show/${item.observationId}`} prefixGroup={true}>
        <Link>
          <AspectRatio maxW="100%" mb={2} ratio={1}>
            <Image
              borderTopRadius="md"
              objectFit="cover"
              overflow="hidden"
              src={getImageThumb(item.resource, user?.id)}
              fallbackSrc={getFallbackByMIME(item.resource?.type)}
            />
          </AspectRatio>

          <Box h="4.6rem" p={4}>
            <Heading size="sm" className="elipsis" title={item?.commonName}>
              <ScientificName value={item?.scientificName || t("common:unknown")} />{" "}
              {!item?.scientificName && (
                <Badge colorScheme="red">{t("observation:help_identify")}</Badge>
              )}
            </Heading>

            <Text color="gray.600" mt={1} fontSize="sm" title={item?.commonName}>
              {item?.commonName}
            </Text>
          </Box>
        </Link>
      </LocalLink>
      <Badge
        borderRadius="xl"
        children={t(ASSET_STATUS[item.status]?.text)}
        colorScheme={ASSET_STATUS[item.status]?.colorScheme}
        m={3}
        position="absolute"
        px={2}
        py={1}
        right={0}
        top={0}
        variant="solid"
      />
    </Box>
  );
}
