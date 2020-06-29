import { Box, Button, Image, Input } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import { axGetYouTubeInfo } from "@services/utility.service";
import { DEFAULT_LICENSE } from "@static/licenses";
import { ASSET_TYPES } from "@static/observation-create";
import { getYoutubeImage } from "@utils/media";
import { nanoid } from "nanoid";
import React, { useState } from "react";

import useObservationCreate from "../use-observation-resources";

export default function FromURL({ onDone }) {
  const { t } = useTranslation();
  const [resourceLink, setResourceLink] = useState<string>();
  const [thumbURL, setThumbURL] = useState<string>();
  const { addAssets } = useObservationCreate();

  const handleOnChange = (e) => {
    setResourceLink(e.target.value);
    setThumbURL(getYoutubeImage(e.target.value));
  };

  const handleonInsert = async () => {
    try {
      const { success, title } = await axGetYouTubeInfo(resourceLink);
      if (success) {
        const ID = nanoid();
        await addAssets(
          [
            {
              hashKey: ID,
              url: resourceLink,
              path: null,
              caption: title,
              type: ASSET_TYPES.VIDEO,
              status: AssetStatus.Uploaded,
              licenceId: DEFAULT_LICENSE,
              rating: 0,
              isUsed: 0
            } as IDBObservationAsset
          ],
          true
        );
        setThumbURL("");
        setResourceLink("");
        onDone();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box minH="22rem">
      <Input
        mb={4}
        type="text"
        placeholder={t("OBSERVATION.YOUTUBE_PLACEHOLDER")}
        value={resourceLink}
        onChange={handleOnChange}
      />
      {thumbURL && <Image mb={4} borderRadius="lg" maxW="full" h="15rem" src={thumbURL} />}
      <Button
        isDisabled={!thumbURL}
        leftIcon="check"
        onClick={handleonInsert}
        type="button"
        variantColor="blue"
      >
        {t("OBSERVATION.USE_IN_OBSERVATION")}
      </Button>
    </Box>
  );
}
