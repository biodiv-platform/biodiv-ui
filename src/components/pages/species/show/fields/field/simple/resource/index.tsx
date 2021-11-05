import {
  AspectRatio,
  Box,
  Grid,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import ExternalBlueLink from "@components/@core/blue-link/external";
import LocalLink from "@components/@core/local-link";
import Badge from "@components/@core/user/badge";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceRAW, getResourceThumbnail } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SpeciesFieldResource({ resources }) {
  const { t } = useTranslation();

  return (
    <>
      {resources?.length > 0 && (
        <SimpleGrid columns={{ base: 2, sm: 4, md: 6 }} spacing={4} p={3} pb={0}>
          {resources.map(({ resource, userIbp }) => (
            <Popover key={resource.id}>
              <PopoverTrigger>
                <AspectRatio ratio={1}>
                  <Image
                    cursor="pointer"
                    objectFit="cover"
                    borderRadius="md"
                    loading="lazy"
                    ignoreFallback={true}
                    bg="gray.200"
                    src={getResourceThumbnail(
                      resource.context,
                      resource.fileName,
                      RESOURCE_SIZE.DEFAULT
                    )}
                    alt={resource.description}
                    title={resource.description}
                  />
                </AspectRatio>
              </PopoverTrigger>
              <PopoverContent fontSize="sm">
                <PopoverArrow />
                <PopoverBody>
                  <div>{resource.description}</div>

                  <Grid templateColumns="1fr 2fr">
                    <Box>{t("observation:contributor")}</Box>
                    <Box>{resource?.contributor || userIbp?.name}</Box>

                    <Box>{t("common:uploader")}</Box>
                    <Box>
                      <LocalLink href={`/user/show/${userIbp.id}`}>
                        <BlueLink>
                          {userIbp.name} <Badge isAdmin={userIbp?.isAdmin} />
                        </BlueLink>
                      </LocalLink>
                    </Box>
                  </Grid>

                  <div>
                    <ExternalBlueLink href={getResourceRAW(resource.context, resource.fileName)}>
                      {t("species:view_original")}
                    </ExternalBlueLink>
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}
