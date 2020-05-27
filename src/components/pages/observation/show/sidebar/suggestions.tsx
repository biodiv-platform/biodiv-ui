import { AspectRatioBox, Box, Button, Image, Link, SimpleGrid } from "@chakra-ui/core";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@configs/i18n/useTranslation";
import { getObservationThumbnail, getSpeciesIcon } from "@utils/media";
import React, { useReducer } from "react";

interface ISuggestionsProps {
  list: any[];
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
    ({ page }) => {
      const nextPage = ++page;
      return { hideMore: nextPage * pageSize > list.length, page: nextPage };
    },
    { hideMore: false, page: 1 }
  );

  return (
    <Box mb={4} className="white-box">
      <BoxHeading>📍 {t(title)}</BoxHeading>
      <SimpleGrid columns={4} spacing={4} p={4}>
        {list.slice(0, page * pageSize).map((o) => (
          <LocalLink
            key={o.observationId}
            href={`/observation/show/${o.observationId}`}
            prefixGroup={true}
          >
            <Link className="fade" title={o.name}>
              <AspectRatioBox ratio={1}>
                <Image
                  overflow="hidden"
                  objectFit="cover"
                  alt={o.name}
                  src={getObservationThumbnail(o[observationKey], 80)}
                  fallbackSrc={getSpeciesIcon(o?.speciesGroupName || defaultSpeciesGroup)}
                  bg="gray.200"
                  borderRadius="md"
                />
              </AspectRatioBox>
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
