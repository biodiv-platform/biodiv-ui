import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useObservationFilter from "../common/use-observation-filter";

const CropTab = dynamic(() => import("./crop-tab"));

export default function CropModal() {
  const { cropObservationData, setCropObservationData } = useObservationFilter();
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={cropObservationData}
      onClose={() => setCropObservationData(undefined)}
      size="5xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("observation:crop:title")}</ModalHeader>
        <ModalCloseButton />
        <Box minH={"fit-content"}>
          <ModalBody>
            {cropObservationData && (
              <CropTab data={cropObservationData} setData={setCropObservationData} />
            )}
          </ModalBody>
        </Box>
      </ModalContent>
    </Modal>
  );
}
