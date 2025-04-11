import { Button, SimpleGrid } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { axPredictObservation } from "@services/api.service";
import { getImageFilesAsBlobs } from "@services/observation.service";
import { DEFAULT_TOAST } from "@static/observation-create";
import { resizePredictImage } from "@utils/image";
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

import ImagePickerSpecRec from "./image-picker-spec-rec";

const SpecRecPrediction = ({
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

  const { getCheckboxProps } = useCheckboxGroup({
    value: selectedImages.length > 0 ? selectedImages.map((o) => o?.resource?.id) : []
  });

  useEffect(() => {
    setSelectedImages(images.slice(0, 1 <= images.length ? 1 : images.length));
  }, [images]);

  useEffect(() => {
    const predictionData = plantnetData?.map((v) => ({
      value: v.speciesName,
      label: v.speciesName,
      group: getLocalIcon(v.speciesGroup),
      score: v.confidence + " %",
      prediction: true,
      source: "SpecRec"
    }));
    setPredictions(predictionData);
  }, [plantnetData]);

  const handleOnPlantnetSelect = async () => {
    const imageUrls = selectedImages.map(
      (o) => `${SITE_CONFIG.SITE.URL}/files-api/api/get/raw/observations/${o.resource.fileName}`
    );

    const imageBlob = await getImageFilesAsBlobs(imageUrls);
    let imageFile;
    if (imageBlob != undefined) {
      imageFile = new File([imageBlob], "image.jpeg", {
        type: imageBlob?.type
      });
    }

    const _thumbURL = await resizePredictImage(imageFile);

    toastIdRef.current = toaster.create({
      ...DEFAULT_TOAST.LOADING,
      description: t("form:uploader.predicting")
    });

    const { success: predictSuccess, data } = await axPredictObservation(_thumbURL);
    if (predictSuccess) {
      setPlantNetData(data);
      const predictionData = plantnetData?.map((v) => ({
        value: v.speciesName,
        label: v.speciesName,
        group: getLocalIcon(v.speciesGroup),
        score: v.confidence + " %",
        prediction: true,
        source: "SpecRec"
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
                <ImagePickerSpecRec
                  key={o.resource.id}
                  selectedImages={selectedImages}
                  setter={setSelectedImages}
                  image={o}
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

export default SpecRecPrediction;
