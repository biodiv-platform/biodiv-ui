import { Box, Button, Image, Input } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import CheckIcon from "@icons/check";
import { AssetStatus, IDBObservationAsset } from "@interfaces/custom";
import { axGetYouTubeInfo } from "@services/utility.service";
import { ASSET_TYPES } from "@static/observation-create";
import { getYoutubeImage } from "@utils/media";
import { nanoid } from "nanoid";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

export default function FromURL({ onDone, onSave }) {
  const { t } = useTranslation();
  const [resourceLink, setResourceLink] = useState<string>();
  const [thumbURL, setThumbURL] = useState<string>();

  const handleOnChange = (e) => {
    setResourceLink(e.target.value);
    setThumbURL(getYoutubeImage(e.target.value));
  };

  const handleonInsert = async () => {
    try {
      const { success, title } = await axGetYouTubeInfo(resourceLink);
      if (success) {
        const ID = nanoid();
        await onSave(
          [
            {
              hashKey: ID,
              url: resourceLink,
              path: undefined,
              caption: title,
              type: ASSET_TYPES.VIDEO,
              status: AssetStatus.Uploaded,
              licenseId: SITE_CONFIG.LICENSE.DEFAULT,
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
        id="ytb-link"
        placeholder={t("form:youtube_placeholder")}
        value={resourceLink}
        onChange={handleOnChange}
      />
      {thumbURL && <Image mb={4} borderRadius="lg" maxW="full" h="15rem" src={thumbURL} />}
      <Button
        isDisabled={!thumbURL}
        leftIcon={<CheckIcon />}
        onClick={handleonInsert}
        type="button"
        colorScheme="blue"
      >
        {t("form:use_in_observation")}
      </Button>
    </Box>
  );
}
