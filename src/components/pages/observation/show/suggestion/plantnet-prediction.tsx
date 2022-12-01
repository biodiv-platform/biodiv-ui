import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useCheckboxGroup,
  useToast
} from "@chakra-ui/react";
import { axGetPlantnetSuggestions } from "@services/observation.service";
import { DEFAULT_TOAST } from "@static/observation-create";
import { getLocalIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";

import ImagePicker from "./image-picker";
const PlantnetPrediction = ({ images, setX, isOpenImageModal, onCloseImageModal }) => {
  const toast = useToast();
  const toastIdRef = React.useRef<any>();
  const { t } = useTranslation();

  //   const {
  //     isOpen: isOpenImageModal,
  //     onOpen: onOpenimageModal,
  //     onClose: onCloseImageModal
  //   } = useDisclosure();
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
    const temp = plantnetData?.map((v) => ({
      value: v.species.scientificName,
      label: v.species.scientificName,
      group: getLocalIcon("Plants"),
      score: (v.score * 100).toFixed(3) + " %",
      prediction: true,
      images: v.images
    }));
    setX(temp);
  }, [plantnetData]);

  const handleOnPlantnetSelect = async () => {
    const imageUrls = selectedImages.map(
      (o) =>
        `https://venus.strandls.com/files-api/api/get/crop/plantnet/observations/${o.resource.fileName}`
    );

    const finalOrgans = selectedImages.map((image) => {
      const obj = organs.find((o) => {
        if (o.imageId === image.resource.id) {
          return true; // stop searching
        }
      });

      return obj.organ;
    });

    toastIdRef.current = toast({
      ...DEFAULT_TOAST.LOADING,
      description: t("form:uploader.predicting")
    });

    const { success, data } = await axGetPlantnetSuggestions(imageUrls, finalOrgans);

    if (success) {
      setPlantNetData(data.results);
      const temp = plantnetData?.map((v) => ({
        value: v.species.scientificName,
        label: v.species.scientificName,
        group: getLocalIcon("Plants"),
        score: v.score.toFixed(3),
        prediction: true,
        images: v.images
      }));
      setX(temp);
      toast.update(toastIdRef.current, {
        ...DEFAULT_TOAST.SUCCESS,
        description: t("common:success")
      });
      onCloseImageModal();
      setTimeout(() => toast.close(toastIdRef.current), 1000);
    } else {
      //   toast({
      //     title: "Failed to generate predictions",
      //     status: "error",
      //     isClosable: true,
      //     position: "top"
      //   });
      toast.update(toastIdRef.current, {
        title: "Failed to generate predictions",
        status: "error",
        isClosable: true,
        position: "top"
      });
    }
  };

  return (
    <div>
      <Modal isOpen={isOpenImageModal} size="6xl" onClose={onCloseImageModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleOnPlantnetSelect}>
              Generate predictions
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PlantnetPrediction;
