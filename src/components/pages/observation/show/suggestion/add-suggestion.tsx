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
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import { axGetObservationById, axRecoSuggest } from "@services/observation.service";
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
  sgroupId;
}

export default function AddSuggestion({
  isLocked,
  observationId,
  recoUpdated,
  recoVotesLength,
  sgroupId
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

  const [x, setX] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  //const [sgroupId, setSgroupId] = useState(null);

  const availablePredictionModels = [
    {
      model: "plantnet",
      isActive: SITE_CONFIG.PLANTNET.ACTIVE && sgroupId == SITE_CONFIG.PLANTNET.PLANT_SGROUP_ID
    }
  ];

  useEffect(() => {
    axGetLangList().then(({ data }) =>
      setLanguages(data.map((l) => ({ label: l.name, value: l.id })))
    );

    axGetObservationById(observationId).then(({ data }) => {
      setImages(data.observationResource);
      // setSgroupId(data.observation.groupId);
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

  console.log("sgroupid=", sgroupId);

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

                  {SITE_CONFIG.PLANTNET.ACTIVE &&
                    sgroupId == SITE_CONFIG.PLANTNET.PLANT_SGROUP_ID && (
                      <PlantnetPrediction
                        images={images}
                        setX={setX}
                        isOpenImageModal={isOpenImageModal}
                        onCloseImageModal={onCloseImageModal}
                      />
                    )}

                  {availablePredictionModels.filter((o) => o.isActive == true).length > 0 ? (
                    <Flex>
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          identify using
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            isDisabled={sgroupId != SITE_CONFIG.PLANTNET.PLANT_SGROUP_ID}
                            value="plantnet"
                            onClick={onOpenimageModal}
                          >
                            Plantnet
                          </MenuItem>
                        </MenuList>
                      </Menu>
                      <Spacer />
                      <SubmitButton leftIcon={<CheckIcon />}>
                        {t("observation:suggest")}
                      </SubmitButton>
                    </Flex>
                  ) : (
                    <SubmitButton leftIcon={<CheckIcon />}>{t("observation:suggest")}</SubmitButton>
                  )}
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
