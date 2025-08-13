import { AspectRatio, Box, Button, Image, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import ScientificName from "@components/@core/scientific-name";
import Tooltip from "@components/@core/tooltip";
import { RESOURCE_SIZE } from "@static/constants";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useReducer } from "react";

interface ISuggestionsProps {
  list?: any[];
  title: string;
  observationKey: string;
  pageSize?: number;
  defaultSpeciesGroup?: string;
}

export default function Suggestions({
  list,
  title,
  observationKey,
  pageSize = 12,
  defaultSpeciesGroup
}: ISuggestionsProps) {
  const { t } = useTranslation();

  const [{ page, hideMore }, loadMore] = useReducer(
    (o) => {
      const nextPage = o.page + 1;
      return { hideMore: nextPage * pageSize > (list || []).length, page: nextPage };
    },
    { hideMore: false, page: 1 }
  );

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📍 {t(title)}</BoxHeading>
      <SimpleGrid columns={4} gap={4} p={4}>
        {list?.slice(0, page * pageSize).map((o) => (
          <LocalLink
            key={o.observationId}
            hardLink={true}
            href={`/observation/show/${o.observationId}`}
            prefixGroup={true}
          >
            <Tooltip showArrow={true} title={<ScientificName value={o.name} />}>
              <AspectRatio ratio={1}>
                <Image
                  overflow="hidden"
                  objectFit="cover"
                  loading="lazy"
                  alt={o.name}
                  src={
                    o[observationKey] != "null"
                      ? getResourceThumbnail(
                          RESOURCE_CTX.OBSERVATION,
                          o[observationKey],
                          RESOURCE_SIZE.RECENT_THUMBNAIL
                        )
                      : getLocalIcon(o?.speciesGroupName || defaultSpeciesGroup)
                  }
                  bg="gray.200"
                  borderRadius="md"
                />
              </AspectRatio>
            </Tooltip>
          </LocalLink>
        ))}
      </SimpleGrid>
      <Button w="full" rounded={0} hidden={hideMore} onClick={loadMore} variant={"subtle"}>
        {t("common:load_more")}
      </Button>
    </Box>
  );
}
