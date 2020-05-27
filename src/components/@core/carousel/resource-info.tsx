import {
  Box,
  Grid,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { axRateObservationResource } from "@services/observation.service";
import { LICENSES } from "@static/licenses";
import toast from "cogo-toast";
import React from "react";
import Rating from "react-rating";

function CarouselResourceInfo({ currentResource, observationId }) {
  const { t } = useTranslation();

  const onRateHandler = async (newRating) => {
    const { success } = await axRateObservationResource(
      observationId,
      currentResource.resource.id,
      newRating
    );
    if (success) {
      toast.success(`${t("OBSERVATION.RATE_SUCCESS")} ${newRating}`);
    }
  };

  const currentLicense = LICENSES[currentResource?.resource?.licenseId];

  return (
    <Box position="absolute" top={4} right={4} left={0} display="flex" justifyContent="flex-end">
      <Popover placement="bottom-end" closeOnBlur={false}>
        <PopoverTrigger>
          <IconButton
            icon="info-outline"
            aria-label={t("OBSERVATION.RESOURCE_INFO")}
            zIndex={4}
            isRound={true}
          />
        </PopoverTrigger>
        <PopoverContent zIndex={4}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{t("OBSERVATION.RESOURCE_INFO")}</PopoverHeader>
          <PopoverBody>
            <Grid templateColumns="1fr 2fr" gap={3}>
              <Box>{t("OBSERVATION.CONTRIBUTOR")}</Box>
              <Box>{currentResource?.user?.name}</Box>

              <Box>{t("OBSERVATION.LICENSE")}</Box>
              <Box>
                <Link target="_blank" href={currentLicense?.link}>
                  {currentLicense?.name} <Icon name="external-link" />
                </Link>
              </Box>

              <Box>{t("OBSERVATION.RATING")}</Box>
              <Box>
                <Rating
                  initialRating={currentResource?.resource?.rating}
                  onChange={onRateHandler}
                  emptySymbol={<Icon name="ibpstaroutline" />}
                  fullSymbol={<Icon name="ibpstar" />}
                />
              </Box>
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}

export default CarouselResourceInfo;
