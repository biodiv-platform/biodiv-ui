import { AspectRatio, Badge, Box, Heading, Image, LinkOverlay, Text } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import useGlobalState from "@hooks/use-global-state";
import { AssetStatus } from "@interfaces/custom";
import { getFallbackByMIME } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { getImageThumb } from "../../create/form/uploader/observation-resources/resource-card";

const ASSET_STATUS = {
  [AssetStatus.InProgress]: { colorPalette: "orange", text: "observation:status.in_progress" },
  [AssetStatus.Uploaded]: { colorPalette: "green", text: "observation:status.uploaded" },
  [AssetStatus.Failed]: { colorPalette: "red", text: "observation:status.failed" }
};
export default function ProgressCard({ item }) {
  const { user } = useGlobalState();
  const { t } = useTranslation();

  return (
    <Box position="relative" className="white-box fade" flex="0 0 250px">
      <LocalLink
        href={item?.observationId ? `/observation/show/${item?.observationId}` : "#"}
        prefixGroup={true}
      >
        <LinkOverlay target="_blank">
          <AspectRatio maxW="100%" mb={2} ratio={1}>
            <Image
              borderTopRadius="md"
              objectFit="cover"
              overflow="hidden"
              src={getImageThumb(item.resource, user?.id)}
              alt={getFallbackByMIME(item.resource?.type)}
            />
          </AspectRatio>

          <Box h="4.6rem" p={4}>
            <Heading size="sm" className="elipsis" title={item?.commonName}>
              <ScientificName value={item?.scientificName || t("common:unknown")} />{" "}
              {!item?.scientificName && (
                <Badge colorPalette="red">{t("observation:help_identify")}</Badge>
              )}
            </Heading>

            <Text color="gray.600" mt={1} fontSize="sm" title={item?.commonName}>
              {item?.commonName}
            </Text>
          </Box>
        </LinkOverlay>
      </LocalLink>
      <Badge
        borderRadius="xl"
        children={t(ASSET_STATUS[item.status]?.text)}
        colorPalette={ASSET_STATUS[item.status]?.colorPalette}
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
