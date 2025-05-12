import { Box, Button, useDisclosure } from "@chakra-ui/react";
import GridIcon from "@icons/grid";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense } from "react";

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import useSpecies from "../../use-species";

const SpeciesGalleryForm = React.lazy(() => import("./form"));
const SpeciesGalleryList = React.lazy(() => import("./list"));

export default function SpeciesGalleryModal({ resources, setResources }) {
  const { open, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const { permissions } = useSpecies();

  return (
    <>
      <Box position="absolute" top={0} right={0} p={4} zIndex={1}>
        <Button onClick={onOpen} variant={"subtle"}>
          <GridIcon />
          {t("species:all_media")}
        </Button>
      </Box>
      <DialogRoot open={open} size="xl" onOpenChange={onClose}>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>{t("species:all_media")}</DialogHeader>
          <DialogCloseTrigger />
          {open ? (
            permissions.isContributor ? (
              <Suspense fallback={null}>
                <SpeciesGalleryForm
                  resources={resources}
                  setResources={setResources}
                  onClose={onClose}
                />
              </Suspense>
            ) : (
              <Suspense fallback={null}>
                <SpeciesGalleryList resources={resources} />
              </Suspense>
            )
          ) : null}
        </DialogContent>
      </DialogRoot>
    </>
  );
}
