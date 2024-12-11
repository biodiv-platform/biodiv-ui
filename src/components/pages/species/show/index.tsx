import {
  Box,
  Button,
  Grid,
  GridItem,
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
  useDisclosure
} from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@icons/add";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { axCreateSpeciesReferences } from "@services/species.service";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { SpeciesActivity } from "./activity";
import SpeciesCommonNamesContainer from "./common-names";
import SpeciesFields from "./fields";
import ReferencesField from "./fields/field/edit/references-field";
import { generateReferencesList } from "./fields/field/references/utils";
import SpeciesGallery from "./gallery";
import SpeciesGroups from "./group";
import SpeciesHeader from "./header";
import SpeciesNavigation from "./navigation";
import SpeciesSidebar from "./sidebar";
import SpeciesSynonymsContainer from "./synonyms";
import { SpeciesProvider } from "./use-species";

export default function SpeciesShowPageComponent({ species, permissions, licensesList }) {
  console.debug("Species", species, permissions);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { t } = useTranslation();

  const fieldsRender = useMemo(
    () => generateReferencesList(species.fieldData),
    [species.fieldData]
  );

  const hFormRef = useForm<any>({
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
      // Add default values for references array
      // references: species.referencesListing || [] // Initialize with existing data
    }
  });

  const handleOnSave = async (values) => {
    const payload: any[] = [];

    values.references.forEach((ref) =>
      payload.push({
        title: ref.title,
        url: ref.url,
        speciesId: species.species.id
      })
    );

    const { success } = await axCreateSpeciesReferences(payload, species.species.id);
    if (success) {
      onClose();
    }
  };

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

            {/*
            This should be the new component 
            */}

            <ToggleablePanel id="123" icon="📚" title="References">
              <Box margin={3}>
                <Button
                  variant="outline"
                  size="xs"
                  colorScheme="green"
                  leftIcon={<AddIcon />}
                  onClick={onOpen}
                >
                  {t("common:add")}
                </Button>

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <FormProvider {...hFormRef}>
                      <form onSubmit={hFormRef.handleSubmit(handleOnSave)}>
                        <ModalHeader>References</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <ReferencesField name="references" label={t("species:references")} />
                        </ModalBody>
                        <ModalFooter>
                          <Button type="submit" colorScheme="blue" leftIcon={<CheckIcon />}>
                            {t("common:save")}
                          </Button>
                          <Button
                            ml={4}
                            leftIcon={<CrossIcon />}
                            onClick={onClose}
                            type="button" // Important: specify type="button" to prevent form submission
                          >
                            {t("common:cancel")}
                          </Button>
                        </ModalFooter>
                      </form>
                    </FormProvider>
                  </ModalContent>
                </Modal>
              </Box>
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
              <Box p={4} pb={0}>
                <Box fontSize="md" mb={1}>
                  <Box fontWeight={600} fontSize="md" mb={1}>
                    Common references
                  </Box>
                  <Box>
                    <OrderedList>
                      {species.referencesListing.map((r) => (
                        <ListItem key={r.id}>
                          {r.title} {r.url && <ExternalBlueLink href={r.url} />}
                        </ListItem>
                      ))}
                    </OrderedList>
                  </Box>
                </Box>
              </Box>
            </ToggleablePanel>
          </GridItem>
          <SpeciesSidebar />
        </Grid>

        <SpeciesGroups />
        <SpeciesActivity />
      </div>
    </SpeciesProvider>
  );
}
