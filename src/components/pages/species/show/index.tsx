import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  SimpleGrid,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import ExternalBlueLink from "@components/@core/blue-link/external";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@icons/add";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import EditIcon from "@icons/edit";
import { Reference } from "@interfaces/species";
import {
  axCreateSpeciesReferences,
  axDeleteSpeciesReferences,
  axUpdateSpeciesReferences
} from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { SpeciesActivity } from "./activity";
import SpeciesCommonNamesContainer from "./common-names";
import CommonReferencesField from "./common-references-field";
import SpeciesFields from "./fields";
import { generateReferencesList } from "./fields/field/references/utils";
import SpeciesGallery from "./gallery";
import SpeciesGroups from "./group";
import SpeciesHeader from "./header";
import SpeciesNavigation from "./navigation";
import SpeciesSidebar from "./sidebar";
import SpeciesSynonymsContainer from "./synonyms";
import { SpeciesProvider } from "./use-species";

export default function SpeciesShowPageComponent({
  species: initialSpecies,
  permissions,
  licensesList
}) {
  console.debug("Species", initialSpecies, permissions);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [species, setSpecies] = useState(initialSpecies);

  const { t } = useTranslation();

  const fieldsRender = useMemo(
    () => generateReferencesList(species.fieldData),
    [species.fieldData]
  );

  const formRef = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        references: Yup.array().of(
          Yup.object().shape({
            id: Yup.mixed(),
            title: Yup.string().required(),
            url: Yup.string().nullable()
          })
        )
      })
    ),
    defaultValues: {
      references: []
    }
  });

  const handleSave = async (values) => {
    if (selectedReference) {
      // Handle edit
      const payload = {
        title: values.references[0].title,
        url: values.references[0].url === "" ? null : values.references[0].url,
        speciesId: species.species.id,
        id: selectedReference.id,
        speciesFieldId: null
      };

      const { success } = await axUpdateSpeciesReferences(payload, species.species.id);
      if (success) {
        // Update the local state
        setSpecies((prevSpecies) => ({
          ...prevSpecies,
          referencesListing: prevSpecies.referencesListing.map((ref) =>
            ref.id === selectedReference.id ? { ...ref, ...payload } : ref
          )
        }));
        notification("Reference updated successfully", NotificationType.Success);
        onEditClose();
        setSelectedReference(null);
      } else {
        notification("Reference could not be updated", NotificationType.Error);
      }
    } else {
      // Handle add
      const payload = values.references.map((ref) => ({
        title: ref.title,
        url: ref.url === "" ? null : ref.url,
        speciesId: species.species.id
      }));
      const { success, data } = await axCreateSpeciesReferences(payload, species.species.id);
      if (success && data) {
        // Update the local state with the newly created references
        setSpecies((prevSpecies) => ({
          ...prevSpecies,
          referencesListing: [...prevSpecies.referencesListing, ...data]
        }));
        notification("Reference added successfully", NotificationType.Success);
        onAddClose();
      } else {
        notification("Reference could not be added", NotificationType.Error);
      }
    }
  };

  const handleAddClick = () => {
    formRef.reset({ references: [] });
    onAddOpen();
  };

  const handleEditClick = (reference) => {
    setSelectedReference(reference);
    formRef.reset({
      references: [
        {
          id: reference.id,
          title: reference.title,
          url: reference.url
        }
      ]
    });
    onEditOpen();
  };

  const commonReferences = species.referencesListing.filter(
    (reference: Reference) => !reference.isDeleted
  );

  return (
    <SpeciesProvider species={species} permissions={permissions} licensesList={licensesList}>
      <div className="container mt">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ md: 4 }}>
          <SpeciesHeader />
          <SpeciesGallery />
        </SimpleGrid>

        <Grid templateColumns={{ md: "repeat(6, 1fr)" }} gap={4} mb={4}>
          <GridItem colSpan={4}>
            <SpeciesNavigation />
            <SpeciesSynonymsContainer />
            <SpeciesCommonNamesContainer />
            <SpeciesFields />

            <ToggleablePanel id="123" icon="📚" title="References">
              <Box margin={3}>
                {permissions.isContributor && (
                  <Button
                    variant="outline"
                    size="xs"
                    colorScheme="green"
                    leftIcon={<AddIcon />}
                    onClick={handleAddClick}
                  >
                    {t("common:add")}
                  </Button>
                )}

                {/* Add Reference Modal */}
                <Modal isOpen={isAddOpen} onClose={onAddClose} size="6xl">
                  <ModalOverlay />
                  <ModalContent>
                    <FormProvider {...formRef}>
                      <form onSubmit={formRef.handleSubmit(handleSave)}>
                        <ModalHeader>Add References</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <CommonReferencesField
                            name="references"
                            label={t("species:references")}
                            isCommonRefEdit={true}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button type="submit" colorScheme="blue" leftIcon={<CheckIcon />}>
                            {t("common:save")}
                          </Button>
                          <Button
                            ml={4}
                            leftIcon={<CrossIcon />}
                            onClick={onAddClose}
                            type="button"
                          >
                            {t("common:cancel")}
                          </Button>
                        </ModalFooter>
                      </form>
                    </FormProvider>
                  </ModalContent>
                </Modal>

                {/* Edit Reference Modal */}
                <Modal isOpen={isEditOpen} onClose={onEditClose} size="6xl">
                  <ModalOverlay />
                  <ModalContent>
                    <FormProvider {...formRef}>
                      <form onSubmit={formRef.handleSubmit(handleSave)}>
                        <ModalHeader>Edit Reference</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <CommonReferencesField
                            name="references"
                            label={t("species:references")}
                            isCommonRefEdit={true}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button type="submit" colorScheme="blue" leftIcon={<CheckIcon />}>
                            {t("common:save")}
                          </Button>
                          <Button
                            ml={4}
                            leftIcon={<CrossIcon />}
                            onClick={onEditClose}
                            type="button"
                          >
                            {t("common:cancel")}
                          </Button>
                        </ModalFooter>
                      </form>
                    </FormProvider>
                  </ModalContent>
                </Modal>
              </Box>

              {/* Field References Section */}
              <Box p={4} pb={0}>
                {fieldsRender.map(([path, references]) => (
                  <Box key={path} mb={3}>
                    <Box fontWeight={600} fontSize="md" mb={1}>
                      {path}
                    </Box>
                    <OrderedList>
                      {references.map(([title, url], index) => (
                        <ListItem key={index}>
                          {title} {url && <ExternalBlueLink href={url} />}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                ))}
              </Box>

              {/* Common References Section */}
              <Box p={4} pb={0}>
                <Box fontSize="md" mb={1}>
                  <Box fontWeight={600} fontSize="md" mb={1}>
                    Common references
                  </Box>
                  <Box>
                    <OrderedList>
                      {commonReferences.map((r: Reference) => (
                        <Box margin={4} key={r.id}>
                          {!r.isDeleted && (
                            <VStack align="flex-start">
                              <ListItem>
                                {r.title} {r.url && <ExternalBlueLink href={r.url} />}
                              </ListItem>
                              {permissions.isContributor && (
                                <HStack>
                                  <IconButton
                                    colorScheme="blue"
                                    variant="unstyled"
                                    size="s"
                                    icon={<EditIcon />}
                                    onClick={() => handleEditClick(r)}
                                    aria-label={t("common:edit")}
                                    title={t("common:edit")}
                                  />
                                  <DeleteActionButton
                                    observationId={r.id}
                                    title="Delete reference"
                                    description="Are you sure you want to delete this reference?"
                                    deleted="Reference deleted successfully"
                                    deleteFunc={axDeleteSpeciesReferences}
                                    deleteGnfinderName={true}
                                    refreshFunc={() => {
                                      setSpecies((prevSpecies) => ({
                                        ...prevSpecies,
                                        referencesListing: prevSpecies.referencesListing.map(
                                          (ref) =>
                                            ref.id === r.id ? { ...ref, isDeleted: true } : ref
                                        )
                                      }));
                                      return null; // Keep the null return to satisfy TypeScript
                                    }}
                                  />
                                </HStack>
                              )}
                            </VStack>
                          )}
                        </Box>
                      ))}
                    </OrderedList>
                  </Box>
                </Box>
              </Box>
            </ToggleablePanel>
          </GridItem>
          <GridItem colSpan={2}>
            <SpeciesSidebar />
          </GridItem>
        </Grid>

        <SpeciesGroups />
        <SpeciesActivity />
      </div>
    </SpeciesProvider>
  );
}
