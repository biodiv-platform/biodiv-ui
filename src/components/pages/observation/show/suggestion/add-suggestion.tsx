import {
  Box,
  Button,
  Collapsible,
  Flex,
  Image,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  useDisclosure
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axGetObservationById, axRecoSuggest } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import { DEFAULT_GROUP, plantnetText, specRecText } from "@static/constants";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuMenu } from "react-icons/lu";
import * as Yup from "yup";

import { Alert } from "@/components/ui/alert";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";

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
import SpecRecPrediction from "./spec-rec-prediction";

interface IAddSuggestionProps {
  isLocked;
  observationId;
  recoUpdated;
  recoVotesLength;
  sgroupId;
  noOfImages;
}

export default function AddSuggestion({
  isLocked,
  observationId,
  recoUpdated,
  recoVotesLength,
  sgroupId,
  noOfImages
}: IAddSuggestionProps) {
  const { t } = useTranslation();
  const scientificRef: any = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const langRef: any = useRef(null);
  const { languageId } = useGlobalState();
  const { open, onClose, onOpen } = useDisclosure({ defaultOpen: true });
  const {
    open: isOpenImageModal,
    onOpen: onOpenimageModal,
    onClose: onCloseImageModal
  } = useDisclosure();

  const {
    open: isOpenSpecRecImageModal,
    onOpen: onOpenSpecRecImageModal,
    onClose: onCloseSpecRecImageModal
  } = useDisclosure();

  const [predictions, setPredictions] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  let defaultButtonValue;

  type PredictionEngine = "plantnet" | "spec-rec";

  const isSpecRecActive = SITE_CONFIG?.OBSERVATION?.PREDICT?.ACTIVE && noOfImages >= 1;
  const isPlantnetActive = SITE_CONFIG?.PLANTNET?.ACTIVE && noOfImages >= 1;
  const isSgroupPlant = sgroupId == SITE_CONFIG?.PLANTNET?.PLANT_SGROUP_ID;

  const availablePredictionModels = [
    {
      model: "plantnet",
      isActive: isPlantnetActive && isSgroupPlant
    },
    {
      model: "spec-rec",
      isActive: isSpecRecActive
    }
  ];

  if (isPlantnetActive && isSgroupPlant) {
    defaultButtonValue = "plantnet";
  } else {
    const firstActiveModel = availablePredictionModels.find((m) => {
      if (m.isActive) {
        return m;
      }
    });
    defaultButtonValue = firstActiveModel?.model;
  }

  const [buttonValue, setButtonValue] = useState<PredictionEngine>(defaultButtonValue);

  const handleMenuSelect = (e) => {
    setButtonValue(e.value);
  };

  useEffect(() => {
    axGetLangList().then(({ data }) =>
      setLanguages(data.map((l) => ({ label: l.name, value: l.id })))
    );

    axGetObservationById(observationId).then(({ data }) => {
      setImages(
        data.observationResource.filter((o) => {
          return o.resource.type === "IMAGE";
        })
      );
    });
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

  const onScientificNameChange = ({ label, value, groupId, raw, source }) => {
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
    hForm.setValue("source", source);
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

  const handleOnClick = (e) => {
    if (e.target.innerText == plantnetText || e.target.id == plantnetText) {
      onOpenimageModal();
    }

    if (e.target.innerText == specRecText || e.target.id == specRecText) {
      onOpenSpecRecImageModal();
    }
  };

  const isOnlyPlantnetActive = () => {
    let count = 0;
    availablePredictionModels.forEach((m) => {
      if (m.isActive) {
        count += 1;
      }
    });
    if (count == 1 && isPlantnetActive && isSgroupPlant) {
      return true;
    } else {
      return false;
    }
  };

  return languages.length > 0 ? (
    isLocked ? (
      <Alert status="success">{t("observation:id.validated")}</Alert>
    ) : (
      <>
        <Box className="fade" hidden={!open}>
          <Collapsible.Root open={open} unmountOnExit={true}>
            <Collapsible.Content>
              <Box p={4}>
                <FormProvider {...hForm}>
                  <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                    <SimpleGrid columns={[1, 1, 3, 3]} gap={4}>
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
                    <Box onMouseEnter={() => scientificRef.current.focus()}>
                      <SelectAsyncInputField
                        name="scientificNameTaxonId"
                        label={t("observation:scientific_name")}
                        onQuery={onScientificNameQuery}
                        optionComponent={ScientificNameOption}
                        placeholder={t("form:min_three_chars")}
                        onChange={onScientificNameChange}
                        options={predictions || []}
                        selectRef={scientificRef}
                        openMenuOnFocus={true}
                      />
                    </Box>

                    {predictions.length > 0 && (
                      <Text color="green">{t("observation:plantnet.pedictions_ready")}</Text>
                    )}

                    {isPlantnetActive && isSgroupPlant && (
                      <PlantnetPrediction
                        images={images}
                        setPredictions={setPredictions}
                        isOpenImageModal={isOpenImageModal}
                        onCloseImageModal={onCloseImageModal}
                        selectRef={scientificRef}
                      />
                    )}

                    {isSpecRecActive && (
                      <SpecRecPrediction
                        images={images}
                        setPredictions={setPredictions}
                        isOpenImageModal={isOpenSpecRecImageModal}
                        onCloseImageModal={onCloseSpecRecImageModal}
                        selectRef={scientificRef}
                      />
                    )}

                    {availablePredictionModels.filter((o) => o.isActive == true).length > 0 ? (
                      <Box>
                        <Text>{t("observation:identify_using")}</Text>
                        <Flex>
                          <Button
                            size="md"
                            onClick={handleOnClick}
                            colorPalette="green"
                            variant="outline"
                          >
                            {buttonValue == "plantnet" && (
                              <Stack direction={"row"} align="center">
                                <Image
                                  id="Pl@ntNet"
                                  src="/plantnet-icon-removebg-preview.ico"
                                  onClick={handleOnClick}
                                  defaultValue="plantnet"
                                />
                                <Text>{plantnetText}</Text>
                              </Stack>
                            )}

                            {buttonValue == "spec-rec" && (
                              <Stack direction={"row"} align="center">
                                <Image
                                  id="SpecRec"
                                  src={DEFAULT_GROUP.icon + "?w=30&preserve=true"}
                                  onClick={handleOnClick}
                                  defaultValue="spec-rec"
                                />
                                <Text id="spec-rec" onClick={handleOnClick}>
                                  {specRecText}
                                </Text>
                              </Stack>
                            )}
                          </Button>

                          <MenuRoot onSelect={(e) => handleMenuSelect(e)}>
                            <MenuTrigger aria-label="Options">
                              <Button variant="outline" size="sm">
                                <LuMenu />
                              </Button>
                            </MenuTrigger>
                            <MenuContent defaultValue="plantnet">
                              {isPlantnetActive && (
                                <MenuItem
                                  disabled={!isSgroupPlant || isOnlyPlantnetActive()}
                                  value="plantnet"
                                >
                                  <Image src="/plantnet-icon-removebg-preview.ico" />
                                  <Text>{plantnetText}</Text>
                                </MenuItem>
                              )}

                              {isSpecRecActive && (
                                <MenuItem value="spec-rec">
                                  <Image
                                    id="SpecRec"
                                    src={DEFAULT_GROUP.icon + "?w=30&preserve=true"}
                                  />
                                  <Text>{specRecText}</Text>
                                </MenuItem>
                              )}
                            </MenuContent>
                          </MenuRoot>

                          <Spacer />
                          <SubmitButton leftIcon={<CheckIcon />}>
                            {t("observation:suggest")}
                          </SubmitButton>
                        </Flex>
                      </Box>
                    ) : (
                      <Flex>
                        <Spacer />
                        <SubmitButton leftIcon={<CheckIcon />}>
                          {t("observation:suggest")}
                        </SubmitButton>
                      </Flex>
                    )}
                  </form>
                </FormProvider>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        </Box>
        <Alert status="success" hidden={open}>
          {t("observation:id.suggestion_success")}
          <Button variant="plain" colorPalette="blue" onClick={onOpen} ml={1}>
            {t("observation:id.resuggest")}
          </Button>
        </Alert>
      </>
    )
  ) : (
    <Skeleton height="294px" borderRadius={0} />
  );
}
