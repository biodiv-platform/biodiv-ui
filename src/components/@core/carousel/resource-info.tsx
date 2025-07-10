import { Box, Grid, IconButton, RatingGroup, Separator } from "@chakra-ui/react";
import { axRateObservationResource } from "@services/observation.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuInfo } from "react-icons/lu";

import {
  PopoverArrow,
  PopoverBody,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverRoot,
  PopoverTrigger
} from "@/components/ui/popover";

import ExternalBlueLink from "../blue-link/external";
import LocalLink from "../local-link";

interface CarouselResourceInfoProps {
  currentResource;
  observationId?;
}

function CarouselResourceInfo({ currentResource, observationId }: CarouselResourceInfoProps) {
  if (!currentResource) {
    return null;
  }

  const { t } = useTranslation();

  const onRateHandler = async (newRating) => {
    const { success } = await axRateObservationResource(
      observationId,
      currentResource.resource.id,
      newRating
    );
    if (success) {
      notification(`${t("observation:rate_success")} ${newRating}`, NotificationType.Success);
    }
  };

  const url = currentResource?.resource?.url;

  return (
    <Box position="absolute" top={4} right={0} left={4} display="flex">
      <PopoverRoot positioning={{ placement: "bottom-start" }} lazyMount>
        <PopoverTrigger>
          <IconButton
            aria-label={t("observation:resource_info")}
            zIndex={4}
            opacity={0.4}
            rounded={"full"}
            _hover={{ opacity: 1 }}
            variant={"subtle"}
          >
            <LuInfo />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent zIndex={4}>
          <PopoverArrow />
          <PopoverCloseTrigger />
          <PopoverHeader>{t("observation:resource_info")}</PopoverHeader>
          <Separator />
          <PopoverBody>
            <Grid templateColumns="1fr 2fr" gap={3}>
              <Box>{t("observation:contributor")}</Box>
              <Box>{currentResource?.resource?.contributor || currentResource?.userIbp?.name}</Box>

              {url && (
                <>
                  <Box>{t("observation:url")}</Box>
                  <Box lineClamp={1}>
                    <ExternalBlueLink href={url} children={url} />
                  </Box>
                </>
              )}
              <Box>{t("common:uploader")}</Box>
              <Box>
                <LocalLink href={`/user/show/${currentResource?.userIbp?.id}`} prefixGroup={true}>
                  <ExternalBlueLink>{currentResource?.userIbp?.name}</ExternalBlueLink>
                </LocalLink>
              </Box>

              <Box>{t("observation:license")}</Box>
              <Box>
                <ExternalBlueLink href={currentResource?.license?.url}>
                  {currentResource?.license?.name}
                </ExternalBlueLink>
              </Box>

              <Box>{t("observation:rating")}</Box>
              <Box>
                <RatingGroup.Root
                  count={5}
                  defaultValue={currentResource?.resource?.rating}
                  size="sm"
                  readOnly={!observationId}
                  onValueChange={(e) => onRateHandler(e.value)}
                >
                  <RatingGroup.HiddenInput />
                  <RatingGroup.Control />
                </RatingGroup.Root>
              </Box>
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </Box>
  );
}

export default CarouselResourceInfo;
