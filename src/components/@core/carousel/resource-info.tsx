import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Grid,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger
} from "@chakra-ui/react";
import StarIcon from "@icons/star";
import StarOutlineIcon from "@icons/star-outline";
import { axRateObservationResource } from "@services/observation.service";
import toast from "cogo-toast";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import Rating from "react-rating";

import ExternalBlueLink from "../blue-link/external";

function CarouselResourceInfo({ currentResource, observationId }) {
  const { t } = useTranslation();

  const onRateHandler = async (newRating) => {
    const { success } = await axRateObservationResource(
      observationId,
      currentResource.resource.id,
      newRating
    );
    if (success) {
      toast.success(`${t("observation:rate_success")} ${newRating}`);
    }
  };

  return (
    <Box position="absolute" top={4} right={4} left={0} display="flex" justifyContent="flex-end">
      <Popover placement="bottom-end" closeOnBlur={false} isLazy={true}>
        <PopoverTrigger>
          <IconButton
            aria-label={t("observation:resource_info")}
            icon={<InfoOutlineIcon />}
            zIndex={4}
            opacity={0.2}
            isRound={true}
            _hover={{ opacity: 1 }}
          />
        </PopoverTrigger>
        <PopoverContent zIndex={4}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{t("observation:resource_info")}</PopoverHeader>
          <PopoverBody>
            <Grid templateColumns="1fr 2fr" gap={3}>
              <Box>{t("observation:contributor")}</Box>
              <Box>{currentResource?.user?.name}</Box>

              <Box>{t("observation:license")}</Box>
              <Box>
                <ExternalBlueLink href={currentResource?.license?.url}>
                  {currentResource?.license?.name}
                </ExternalBlueLink>
              </Box>

              <Box>{t("observation:rating")}</Box>
              <Box>
                <Rating
                  initialRating={currentResource?.resource?.rating}
                  onChange={onRateHandler}
                  emptySymbol={<StarOutlineIcon />}
                  fullSymbol={<StarIcon />}
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
