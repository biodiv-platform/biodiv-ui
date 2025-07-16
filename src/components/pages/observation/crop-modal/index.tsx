import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useObservationFilter from "../common/use-observation-filter";

const CropTab = dynamic(() => import("./crop-tab"));

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

export default function CropModal() {
  const { cropObservationData, setCropObservationData, canCropObservation } =
    useObservationFilter();
  const { t } = useTranslation();

  return (
    <DialogRoot
      open={cropObservationData}
      onOpenChange={() => setCropObservationData(undefined)}
      size="cover"
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>{t("observation:crop.title")}</DialogHeader>
        <DialogCloseTrigger />
        <Box minH={"fit-content"}>
          <DialogBody>
            {cropObservationData && (
              <CropTab
                data={cropObservationData}
                setData={setCropObservationData}
                canCrop={canCropObservation}
              />
            )}
          </DialogBody>
        </Box>
      </DialogContent>
    </DialogRoot>
  );
}
