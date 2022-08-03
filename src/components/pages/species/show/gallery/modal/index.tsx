import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import GridIcon from "@icons/grid";
import useTranslation from "next-translate/useTranslation";
import React, { Suspense } from "react";

import useSpecies from "../../use-species";

const SpeciesGalleryForm = React.lazy(() => import("./form"));
const SpeciesGalleryList = React.lazy(() => import("./list"));

export default function SpeciesGalleryModal({ resources, setResources }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const { permissions } = useSpecies();

  return (
    <>
      <Box position="absolute" top={0} right={0} p={4} zIndex={1}>
        <Button onClick={onOpen} leftIcon={<GridIcon />}>
          {t("species:all_media")}
        </Button>
      </Box>
      <Modal isOpen={isOpen} size="6xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("species:all_media")}</ModalHeader>
          <ModalCloseButton />
          {isOpen ? (
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
        </ModalContent>
      </Modal>
    </>
  );
}
