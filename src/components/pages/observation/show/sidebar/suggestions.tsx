import { AspectRatio, Box, Button, Image, Link, SimpleGrid } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import { RESOURCE_SIZE } from "@static/constants";
import { getLocalIcon, getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
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
      <SimpleGrid columns={4} spacing={4} p={4}>
        {list?.slice(0, page * pageSize).map((o) => (
          <LocalLink
            key={o.observationId}
            href={`/observation/show/${o.observationId}`}
            prefixGroup={true}
          >
            <Link className="fade" title={o.name}>
              <AspectRatio ratio={1}>
                <Image
                  overflow="hidden"
                  objectFit="cover"
                  alt={o.name}
                  src={getResourceThumbnail(
                    RESOURCE_CTX.OBSERVATION,
                    o[observationKey],
                    RESOURCE_SIZE.RECENT_THUMBNAIL
                  )}
                  fallbackSrc={getLocalIcon(o?.speciesGroupName || defaultSpeciesGroup)}
                  bg="gray.200"
                  borderRadius="md"
                />
              </AspectRatio>
            </Link>
          </LocalLink>
        ))}
      </SimpleGrid>
      <Button w="full" rounded={0} hidden={hideMore} onClick={loadMore}>
        {t("OBSERVATION.LOAD_MORE_OBSERVATIONS")}
      </Button>
    </Box>
  );
}
