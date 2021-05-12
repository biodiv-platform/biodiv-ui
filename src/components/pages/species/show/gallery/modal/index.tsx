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
import useTranslation from "@hooks/use-translation";
import GridIcon from "@icons/grid";
import React from "react";

import useSpecies from "../../use-species";
import SpeciesGalleryForm from "./form";
import SpeciesGalleryList from "./list";

export default function SpeciesGalleryModal({ resources, setResources }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const { permissions } = useSpecies();

  return (
    <>
      <Box position="absolute" top={0} right={0} p={4} zIndex={1}>
        <Button onClick={onOpen} leftIcon={<GridIcon />}>
          {t("SPECIES.ALL_MEDIA")}
        </Button>
      </Box>
      <Modal isOpen={isOpen} size="6xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("SPECIES.ALL_MEDIA")}</ModalHeader>
          <ModalCloseButton />
          {permissions.isContributor ? (
            <SpeciesGalleryForm
              resources={resources}
              setResources={setResources}
              onClose={onClose}
            />
          ) : (
            <SpeciesGalleryList resources={resources} />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
