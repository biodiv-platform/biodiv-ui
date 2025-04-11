import { Button, SimpleGrid } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { axGetPlantnetSuggestions } from "@services/observation.service";
import { DEFAULT_TOAST } from "@static/observation-create";
import { getLocalIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { useCheckboxGroup } from "@/hooks/use-checkbox-group";

import ImagePicker from "./image-picker";
const PlantnetPrediction = ({
  images,
  setPredictions,
  isOpenImageModal,
  onCloseImageModal,
  selectRef
}) => {
  const toastIdRef = React.useRef<any>();
  const { t } = useTranslation();

  const [plantnetData, setPlantNetData] = useState<any[]>([]);

  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [organs, setSelectOrgans] = useState<any[]>([]);

  const { getCheckboxProps } = useCheckboxGroup({
    value: selectedImages.length > 0 ? selectedImages.map((o) => o?.resource?.id) : []
  });

  useEffect(() => {
    setSelectedImages(images.slice(0, 5 <= images.length ? 5 : images.length));
    setSelectOrgans(
      images
        .slice(0, 5 <= images.length ? 5 : images.length)
        .map((o) => ({ imageId: o.resource.id, organ: "auto" }))
    );
  }, [images]);

  useEffect(() => {
    const predictionData = plantnetData?.map((v) => ({
      value: v.species.scientificName,
      label: v.species.scientificName,
      group: getLocalIcon("Plants"),
      score: (v.score * 100).toFixed(3) + " %",
      prediction: true,
      images: v.images,
      source: "Pl@ntNet"
    }));
    setPredictions(predictionData);
  }, [plantnetData]);

  const handleOnPlantnetSelect = async () => {
    const imageUrls = selectedImages.map(
      (o) => `${SITE_CONFIG.SITE.URL}${SITE_CONFIG.PLANTNET.IMAGE_BASE_PATH}${o.resource.fileName}`
    );

    const finalOrgans = selectedImages.map((image) => {
      const organsObj = organs.find((o) => {
        if (o.imageId === image.resource.id) {
          return true; // stop searching
        }
      });

      return organsObj.organ;
    });

    toastIdRef.current = toaster.create({
      ...DEFAULT_TOAST.LOADING,
      description: t("form:uploader.predicting")
    });

    const { success, data } = await axGetPlantnetSuggestions(imageUrls, finalOrgans);

    if (success) {
      setPlantNetData(data.results);
      const predictionData = plantnetData?.map((v) => ({
        value: v.species.scientificName,
        label: v.species.scientificName,
        group: getLocalIcon("Plants"),
        score: v.score.toFixed(3),
        prediction: true,
        images: v.images,
        source: "Pl@ntNet"
      }));
      setPredictions(predictionData);
      toaster.update(toastIdRef.current, {
        ...DEFAULT_TOAST.SUCCESS,
        description: t("common:success")
      });
      onCloseImageModal();
      setTimeout(() => toaster.dismiss(toastIdRef.current), 1000);

      if (selectRef) {
        selectRef.current.focus();
      }
    } else {
      toaster.update(toastIdRef.current, {
        title: `${t("observation:plantnet.failed_to_generate_predictions")}`,
        type: "error",
        // isClosable: true,
        placement: "top"
      });
    }
  };

  return (
    <div>
      <DialogRoot open={isOpenImageModal} size="cover" onOpenChange={onCloseImageModal}>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>{t("observation:plantnet.select_Images")}</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            <SimpleGrid columns={[2, 3, 4, 5]} gridGap={4} mb={4} className="custom-checkbox-group">
              {images.map((o) => (
                <ImagePicker
                  key={o.resource.id}
                  selectedImages={selectedImages}
                  setter={setSelectedImages}
                  image={o}
                  selectedOrgans={organs}
                  organSetter={setSelectOrgans}
                  {...getCheckboxProps({ value: o.resource.id })}
                />
              ))}
            </SimpleGrid>
          </DialogBody>

          <DialogFooter>
            <Button colorPalette="green" mr={3} onClick={handleOnPlantnetSelect}>
              {t("observation:plantnet.generate_predictions")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </div>
  );
};

export default PlantnetPrediction;
