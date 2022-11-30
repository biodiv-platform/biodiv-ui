import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Collapse,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Spacer,
  useDisclosure
} from "@chakra-ui/react";
// import {
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay
// } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axRecoSuggest } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import {
  CommonNameOption,
  getCommonNameOption,
  onCommonNameQuery
} from "../../create/form/recodata/common-name";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "../../create/form/recodata/scientific-name";
import PlantnetPrediction from "./plantnet-prediction";

interface IAddSuggestionProps {
  isLocked;
  observationId;
  recoUpdated;
  recoVotesLength;
  images?;
}

export default function AddSuggestion({
  isLocked,
  observationId,
  recoUpdated,
  recoVotesLength,
  images
}: IAddSuggestionProps) {
  const { t } = useTranslation();
  const scientificRef: any = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const langRef: any = useRef(null);
  const { languageId } = useGlobalState();
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });
  const {
    isOpen: isOpenImageModal,
    onOpen: onOpenimageModal,
    onClose: onCloseImageModal
  } = useDisclosure();
  //const [plantnetData, setPlantNetData] = useState<any[]>([]);
  // const toast = useToast();
  // const toastIdRef = React.useRef<any>();

  const [x, setX] = useState<any[]>([]);

  //const [selectedImages, setSelectedImages] = useState<any[]>([]);
  //const [organs, setSelectOrgans] = useState<any[]>([]);

  // const { getCheckboxProps } = useCheckboxGroup({
  //   value: selectedImages.length > 0 ? selectedImages.map((o) => o?.resource?.id) : []

  // });

  // setPreselectedImages([]);

  useEffect(() => {
    axGetLangList().then(({ data }) =>
      setLanguages(data.map((l) => ({ label: l.name, value: l.id })))
    );
    // setSelectedImages(images.slice(0, 5 <= images.length ? 5 : images.length));
    // setSelectOrgans(
    //   images
    //     .slice(0, 5 <= images.length ? 5 : images.length)
    //     .map((o) => ({ imageId: o.resource.id, organ: "auto" }))
    // );
  }, []);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        taxonCommonName: Yup.string().nullable(),
        scientificNameTaxonId: Yup.mixed().nullable(),
        taxonScientificName: Yup.string().nullable(),
        languageId: Yup.mixed().nullable()
      })
    ),
    defaultValues: {
      taxonCommonName: null,
      scientificNameTaxonId: null,
      taxonScientificName: null,
      languageId: languageId
    }
  });

  // const handleOnPlantnetSelect = async () => {
  //   const imageUrls = selectedImages.map(
  //     (o) => `https://venus.strandls.com/files-api/api/get/raw/observations/${o.resource.fileName}`
  //   );

  //   const finalOrgans = selectedImages.map((image) => {
  //     const obj = organs.find((o) => {
  //       if (o.imageId === image.resource.id) {
  //         return true; // stop searching
  //       }
  //     });

  //     return obj.organ;
  //   });

  //   toastIdRef.current = toast({
  //     ...DEFAULT_TOAST.LOADING,
  //     description: t("form:uploader.predicting")
  //   });

  //   const { success, data } = await axGetPlantnetSuggestions(imageUrls, finalOrgans);

  //   if (success) {
  //     setPlantNetData(data.results);
  //     const temp = plantnetData?.map((v) => ({
  //       value: v.species.scientificName,
  //       label: v.species.scientificName,
  //       group: getLocalIcon("Plants"),
  //       score: v.score.toFixed(3),
  //       prediction: true,
  //       images: v.images
  //     }));
  //     setX(temp);
  //     toast.update(toastIdRef.current, {
  //       ...DEFAULT_TOAST.SUCCESS,
  //       description: t("common:success")
  //     });
  //     onCloseImageModal();
  //     setTimeout(() => toast.close(toastIdRef.current), 1000);
  //   }
  // };

  const onCommonNameChange = ({ sLabel, sValue, lang, langId, groupId, updateScientific }) => {
    if (langId) {
      langRef.current.onChange(
        { value: langId, label: lang },
        { name: langRef.current.props.inputId }
      );
    }
    if ((sLabel || sValue) && updateScientific) {
      scientificRef.current.onChange(
        { value: sValue, label: sLabel, groupId },
        { name: scientificRef.current.props.inputId }
      );
    }
  };

  const onScientificNameChange = ({ label, value, groupId, raw }) => {
    if (value === label) {
      hForm.setValue("scientificNameTaxonId", null);
    }
    hForm.setValue("taxonScientificName", label);
    if (groupId) {
      if (raw?.common_names) {
        setCommonNameOptions(raw.common_names.map((cn) => getCommonNameOption(cn, raw, false)));
      }
      hForm.setValue("sGroup", groupId);
    }
  };

  useEffect(() => {
    hForm.register("taxonScientificName");
  }, [hForm.register]);

  const handleOnSubmit = async (values) => {
    if (values.taxonCommonName || values.taxonScientificName) {
      const { success, data } = await axRecoSuggest(observationId, {
        ...values,
        confidence: "CERTAIN",
        recoComment: ""
      });
      if (success) {
        recoUpdated(data);
        onClose();
        hForm.reset();
      }
    } else {
      notification(t("observation:no_empty_suggestion"));
    }
  };

  useEffect(() => {
    if (recoVotesLength) {
      onOpen();
    }
  }, [recoVotesLength]);

  // useEffect(() => {
  //   const temp = plantnetData?.map((v) => ({
  //     value: v.species.scientificName,
  //     label: v.species.scientificName,
  //     group: getLocalIcon("Plants"),
  //     score: (v.score * 100).toFixed(3) + " %",
  //     prediction: true,
  //     images: v.images
  //   }));
  //   setX(temp);
  // }, [plantnetData]);

  return languages.length > 0 ? (
    isLocked ? (
      <Alert status="success">
        <AlertIcon /> {t("observation:id.validated")}
      </Alert>
    ) : (
      <>
        <Box className="fade" hidden={!isOpen}>
          <Collapse in={isOpen} unmountOnExit={true}>
            <Box p={4}>
              <FormProvider {...hForm}>
                <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                  <SimpleGrid columns={[1, 1, 3, 3]} spacing={4}>
                    <SelectAsyncInputField
                      name="taxonCommonName"
                      label={t("observation:common_name")}
                      style={{ gridColumn: "1/3" }}
                      onQuery={onCommonNameQuery}
                      options={commonNameOptions}
                      optionComponent={CommonNameOption}
                      placeholder={t("form:min_three_chars")}
                      onChange={onCommonNameChange}
                    />
                    <SelectInputField
                      name="languageId"
                      label={t("form:language")}
                      options={languages}
                      selectRef={langRef}
                      shouldPortal={true}
                    />
                  </SimpleGrid>

                  <SelectAsyncInputField
                    name="scientificNameTaxonId"
                    label={t("observation:scientific_name")}
                    onQuery={onScientificNameQuery}
                    optionComponent={ScientificNameOption}
                    placeholder={t("form:min_three_chars")}
                    onChange={onScientificNameChange}
                    options={x ? x : []}
                    selectRef={scientificRef}
                  />

                  {/* <Modal isOpen={isOpenImageModal} size="6xl" onClose={onCloseImageModal}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Select Images</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <SimpleGrid
                          columns={[2, 3, 4, 5]}
                          gridGap={4}
                          mb={4}
                          className="custom-checkbox-group"
                        >
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
                  </Modal> */}

                  <PlantnetPrediction
                    images={images}
                    setX={setX}
                    isOpenImageModal={isOpenImageModal}
                    onCloseImageModal={onCloseImageModal}
                  />

                  <Flex>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        identify using
                      </MenuButton>
                      <MenuList>
                        <MenuItem value="plantnet" onClick={onOpenimageModal}>
                          Plantnet
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Spacer />
                    <SubmitButton leftIcon={<CheckIcon />}>{t("observation:suggest")}</SubmitButton>
                  </Flex>
                </form>
              </FormProvider>
            </Box>
          </Collapse>
        </Box>
        <Alert status="success" hidden={isOpen}>
          <AlertIcon />
          {t("observation:id.suggestion_success")}
          <Button variant="link" colorScheme="blue" onClick={onOpen} ml={1}>
            {t("observation:id.resuggest")}
          </Button>
        </Alert>
      </>
    )
  ) : (
    <Skeleton height="294px" borderRadius={0} />
  );
}
