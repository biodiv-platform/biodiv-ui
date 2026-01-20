import {
  Box,
  Button,
  Grid,
  GridItem,
  IconButton,
  List,
  SimpleGrid,
  useDisclosure
} from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { SubmitButton } from "@components/form/submit-button";
import ToggleablePanel from "@components/pages/common/toggleable-panel";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import AddIcon from "@icons/add";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { Reference } from "@interfaces/species";
import { axGroupList } from "@services/app.service";
import { axGetspeciesGroups } from "@services/observation.service";
import {
  axCreateSpeciesReferences,
  axDeleteSpeciesReferences,
  axGetAllFieldsMeta,
  axGetAllTraitsMetaByTaxonId,
  axGetSpeciesById,
  axUpdateSpeciesReferences
} from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import { normalizeSpeciesPayload } from "@utils/species";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuPencil } from "react-icons/lu";
import * as Yup from "yup";

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
import { ResourceType } from "@/interfaces/custom";
import { axAddDownloadLog } from "@/services/user.service";
import { axDownloadSpecies } from "@/services/utility.service";
import { waitForAuth } from "@/utils/auth";

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
import TaxonEditModal from "./taxon-edit-modal";
import { ReferenceListItem } from "./url-utils";
import { SpeciesProvider } from "./use-species";

export default function SpeciesShowPageComponent({
  species: initialSpecies,
  permissions,
  licensesList
}) {
  console.debug("Species", initialSpecies, permissions);
  const { languageId } = useGlobalState();
  const { open: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { open: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const {
    open: isTaxonEditOpen,
    onOpen: onTaxonEditOpen,
    onClose: onTaxonEditClose
  } = useDisclosure();

  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);
  const [species, setSpecies] = useState(initialSpecies);
  const { t } = useTranslation();

  const fieldsRender = useMemo(
    () => generateReferencesList(species.fieldData),
    [species.fieldData]
  );

  const temporalObservedRef = useRef<{ base64: () => Promise<string> } | null>(null);
  const traitsPerMonthRef = useRef<{ base64: () => Promise<string> } | null>(null);
  const observationsMap = useRef<{ captureMapAsBase64: () => Promise<string> } | null>(null);

  useEffect(() => {
    setSpecies(initialSpecies);
  }, [languageId]);

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
    setSelectedReference(null); // Reset selectedReference when adding new
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

  const commonReferences = species.referencesListing
    .filter((reference: Reference) => !reference.isDeleted && reference.title)
    .sort((a: Reference, b: Reference) => a.title.localeCompare(b.title));

  const handleTaxonUpdate = async (newTaxonId) => {
    try {
      // Get current group info
      const { currentGroup } = await axGroupList(window.location.href);

      // Fetch updated species data with new taxon ID
      const [fieldsMetaResponse, speciesDataResponse, speciesGroupsResponse, traitsMetaResponse] =
        await Promise.all([
          axGetAllFieldsMeta({ langId: languageId, userGroupId: currentGroup?.id }),
          axGetSpeciesById(species.species.id, currentGroup?.id != null ? currentGroup : null),
          axGetspeciesGroups(),
          axGetAllTraitsMetaByTaxonId(newTaxonId, languageId)
        ]);

      if (speciesDataResponse.success && fieldsMetaResponse.success && traitsMetaResponse.success) {
        // Normalize the species payload with updated data
        const updatedSpecies = normalizeSpeciesPayload(
          fieldsMetaResponse.data,
          traitsMetaResponse.data,
          speciesDataResponse.data,
          speciesGroupsResponse.data
        );

        // Update the species state with new breadcrumbs, taxonomyDefinition, and taxonomicNames
        setSpecies(updatedSpecies);
      }
    } catch (error) {
      console.error("Error updating species data:", error);
      // Fallback to just updating the taxonConceptId
      setSpecies((prev) => ({
        ...prev,
        species: {
          ...prev.species,
          taxonConceptId: newTaxonId
        }
      }));
    }
  };

  const languagesData = useMemo(() => {
    const commonNames = species.taxonomicNames?.commonNames || [];

    return commonNames.reduce((acc, curr) => {
      if (!curr?.name) return acc;

      const languageName = curr?.language?.name || "Other";

      if (!acc[languageName]) {
        acc[languageName] = [];
      }

      acc[languageName].push(curr.name);
      return acc;
    }, {});
  }, [species.taxonomicNames?.commonNames]);

  function convertToSimpleStructure(originalData) {
    const SPECIAL_FIELD_IDS = {
      DESCRIPTION: 65,
      HABITAT: 82
    };

    const extractValues = (fieldObj) =>
      fieldObj.values?.map((obj) => ({
        description: obj.fieldData?.description,
        attributions: obj.attributions,
        license: obj.license?.name,
        contributor: obj.contributor?.map((contrib) => contrib.name),
        languageId: obj.fieldData?.languageId
      })) || [];

    const transformTraits = (traits) =>
      traits
        ?.filter((trait) => trait?.values?.length > 0)
        .map((trait) => ({
          name: trait.name,
          options:
            trait.options?.reduce((acc, obj) => {
              acc[obj.traitValueId] = obj.icon ? `${obj.value}|${obj.icon}` : obj.value;
              return acc;
            }, {}) || {},
          values: trait.values.map((obj) => ({
            valueId: obj.valueId,
            value: obj.value,
            fromDate: obj.fromDate,
            toDate: obj.toDate
          })),
          dataType: trait.dataType,
          units: trait.units,
          icon: trait.icon
        })) || [];

    const hasData = (fieldObj) =>
      fieldObj.values?.length > 0 ||
      transformTraits(fieldObj.traits).length > 0 ||
      fieldObj.id === SPECIAL_FIELD_IDS.DESCRIPTION ||
      fieldObj.id === SPECIAL_FIELD_IDS.HABITAT;

    const hasDataInBranch = (field) => {
      const fieldObj = field.parentField || field;
      return hasData(fieldObj) || field.childField?.some((child) => hasDataInBranch(child));
    };

    const transformField = (field) => {
      if (!hasDataInBranch(field)) return null;

      const fieldObj = field.parentField || field;

      return {
        id: fieldObj.id,
        name: fieldObj.header || "",
        values: extractValues(fieldObj),
        traits: transformTraits(fieldObj.traits),
        childField: field.childField?.map(transformField).filter(Boolean) || []
      };
    };

    return originalData.map(transformField).filter(Boolean);
  }

  const RESOURCE_CTX_MAP = {
    MY_UPLOADS: "myUploads",
    OBSERVATION: "observations",
    PAGES: "pages",
    SPECIES_FIELD: "img",
    SPECIES: "img",
    USERGROUPS: "userGroups",
    DOCUMENT_SOCIAL_PREVIEW: "documentSocialPreview"
  };

  const simplifiedData = convertToSimpleStructure(species.fieldData);

  const downloadSpecies = async () => {
    await waitForAuth();
    const toastId = toaster.create({
      type: "loading",
      title: "Generating PDF...",
      duration: Infinity,
      closable: false
    });
    if (temporalObservedRef.current && traitsPerMonthRef.current && observationsMap.current) {
      const chartBase64 = await temporalObservedRef.current.base64();
      const traitsBase64 = await traitsPerMonthRef.current.base64();
      const mapBase64 = await observationsMap.current.captureMapAsBase64();

      const { success, data } = await axDownloadSpecies({
        url: SITE_CONFIG.SITE.URL,
        languageId: languageId,
        title: species?.taxonomyDefinition?.italicisedForm,
        speciesGroup: species.speciesGroup?.name,
        badge: species.taxonomyDefinition.status,
        synonyms: species.taxonomicNames.synonyms.map((obj) => obj.italicisedForm),
        taxonomy: species.breadCrumbs,
        commonNames: languagesData,
        conceptNames: species.fieldData.map((obj) => obj.parentField.header),
        fieldData: simplifiedData,
        references:
          fieldsRender?.reduce((acc, [key, values]) => {
            acc[key] = values?.map((obj) => obj[0]);
            return acc;
          }, {}) || {},
        chartImage: chartBase64,
        traitsChart: traitsBase64,
        observationMap: mapBase64,
        resourceData:
          species?.resourceData
            ?.filter((r) => r.resource.type !== ResourceType.Icon)
            .map((obj) => RESOURCE_CTX_MAP[obj.resource.context] + "/" + obj.resource.fileName) || [],
        documentMetaList: species.documentMetaList.map((obj) => ({
          id: obj.id,
          title: obj.title,
          user: obj.author.name,
          pic: obj.author.profilePic
        })),
        commonReferences: commonReferences.map((obj) => obj.title)
      });

      if (success) {
        toaster.update(toastId, {
          type: "success",
          title: "PDF Generated!",
          duration: 5000,
          closable: true
        });
        if (data instanceof Blob) {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${species?.taxonomyDefinition?.name}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          const payload = {
            filePath: "",
            filterUrl: window.location.href,
            status: "success",
            fileType: "pdf",
            sourcetype: "Species",
            notes: species?.taxonomyDefinition?.name
          };
          axAddDownloadLog(payload);
        }
      } else {
        toaster.update(toastId, {
          type: "error",
          title: "PDF Generation Failed",
          duration: 5000,
          closable: true
        });
      }
    }
  };

  return (
    <SpeciesProvider
      species={species}
      permissions={permissions}
      licensesList={licensesList}
      taxonEditActions={{
        isOpen: isTaxonEditOpen,
        onOpen: onTaxonEditOpen,
        onClose: onTaxonEditClose,
        onTaxonUpdated: handleTaxonUpdate
      }}
    >
      <div className="container mt">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 4, md: 6 }} maxW="100%" w="full">
          <SpeciesHeader downloadSpecies={downloadSpecies} />
          <SpeciesGallery />
        </SimpleGrid>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
          gap={{ base: 4, md: 6 }}
          mb={8}
          width="full"
        >
          <GridItem colSpan={4}>
            <SpeciesNavigation />
            <SpeciesSynonymsContainer />
            <SpeciesCommonNamesContainer />
            <SpeciesFields observationsMap={observationsMap} />

            <ToggleablePanel id="123" icon="📚" title="References">
              <Box margin={3}>
                {permissions.isContributor && (
                  <Button variant="outline" size="xs" colorPalette="green" onClick={handleAddClick}>
                    <AddIcon />
                    {t("common:add")}
                  </Button>
                )}

                {/* Add Reference Modal */}
                <DialogRoot open={isAddOpen} onOpenChange={onAddClose} size="xl" unmountOnExit>
                  <DialogBackdrop />
                  <DialogContent>
                    <FormProvider {...formRef}>
                      <form onSubmit={formRef.handleSubmit(handleSave)}>
                        <DialogHeader fontSize={"xl"} fontWeight={"bold"}>
                          Add References
                        </DialogHeader>
                        <DialogCloseTrigger />
                        <DialogBody>
                          <CommonReferencesField
                            name="references"
                            label={t("species:references")}
                            isCommonRefAdd={true}
                          />
                        </DialogBody>
                        <DialogFooter>
                          <SubmitButton leftIcon={<CheckIcon />} children={t("common:save")} />
                          <Button ml={4} onClick={onAddClose} type="button" variant={"subtle"}>
                            <CrossIcon />
                            {t("common:cancel")}
                          </Button>
                        </DialogFooter>
                      </form>
                    </FormProvider>
                  </DialogContent>
                </DialogRoot>

                {/* Edit Reference Modal */}
                <DialogRoot open={isEditOpen} onOpenChange={onEditClose} size="cover">
                  <DialogBackdrop />
                  <DialogContent>
                    <FormProvider {...formRef}>
                      <form onSubmit={formRef.handleSubmit(handleSave)}>
                        <DialogHeader>Edit Reference</DialogHeader>
                        <DialogCloseTrigger />
                        <DialogBody>
                          <CommonReferencesField
                            name="references"
                            label={t("species:references")}
                            isCommonRefAdd={false}
                          />
                        </DialogBody>
                        <DialogFooter>
                          <SubmitButton leftIcon={<CheckIcon />} children={t("common:save")} />
                          <Button ml={4} onClick={onEditClose} type="button" variant={"subtle"}>
                            <CrossIcon />
                            {t("common:cancel")}
                          </Button>
                        </DialogFooter>
                      </form>
                    </FormProvider>
                  </DialogContent>
                </DialogRoot>
              </Box>

              {/* Field References Section */}
              <Box p={4} pb={0}>
                {fieldsRender.map(([path, references]) => (
                  <Box key={path} mb={3}>
                    <Box fontWeight={600} fontSize="md" mb={1}>
                      {path}
                    </Box>
                    <List.Root as="ol" pl={2}>
                      {references.map(([title, url], index) => (
                        <List.Item key={index}>
                          {title} {url && <ExternalBlueLink href={url} />}
                        </List.Item>
                      ))}
                    </List.Root>
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
                    <List.Root as="ol" pl={2}>
                      {commonReferences.map((r: Reference) => (
                        <Box key={r.id}>
                          {!r.isDeleted && (
                            <ReferenceListItem reference={r} permissions={permissions}>
                              <Box display="inline-flex" ml={2}>
                                <IconButton
                                  variant="plain"
                                  // size="s"
                                  onClick={() => handleEditClick(r)}
                                  aria-label={t("common:edit")}
                                  title={t("common:edit")}
                                >
                                  <LuPencil />
                                </IconButton>
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
                                      referencesListing: prevSpecies.referencesListing.map((ref) =>
                                        ref.id === r.id ? { ...ref, isDeleted: true } : ref
                                      )
                                    }));
                                    return null;
                                  }}
                                />
                              </Box>
                            </ReferenceListItem>
                          )}
                        </Box>
                      ))}
                    </List.Root>
                  </Box>
                </Box>
              </Box>
            </ToggleablePanel>
          </GridItem>
          <GridItem colSpan={2}>
            <SpeciesSidebar
              temporalObservedRef={temporalObservedRef}
              traitsPerMonthRef={traitsPerMonthRef}
            />
          </GridItem>
        </Grid>

        <SpeciesGroups />
        <SpeciesActivity />
      </div>

      {/* Taxon Edit Modal */}
      <TaxonEditModal
        isOpen={isTaxonEditOpen}
        onClose={onTaxonEditClose}
        species={species}
        onTaxonUpdated={handleTaxonUpdate}
      />
    </SpeciesProvider>
  );
}
