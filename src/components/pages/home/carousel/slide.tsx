import { Box, Image } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import { RESOURCE_SIZE } from "@static/constants";
import { getObservationImage } from "@utils/media";
import React from "react";

export default function Slide({ resource }) {
  return (
    <Box className="keen-slider__slide">
      <LocalLink href={`/observation/show/${resource.observationId}`}>
        <a>
          <Image
            src={getObservationImage(resource.fileName, RESOURCE_SIZE.PREVIEW)}
            h={{ base: 240, md: 420, lg: 500 }}
            w="full"
            objectFit="cover"
            loading="lazy"
            ignoreFallback={true}
            alt={resource.id}
          />
        </a>
      </LocalLink>
    </Box>
  );
}
