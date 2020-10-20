import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Collapse,
  SimpleGrid,
  Skeleton,
  useDisclosure
} from "@chakra-ui/core";
import Select from "@components/form/select";
import SelectAsync from "@components/form/select-async";
import Submit from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config.json";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axRecoSuggest } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import notification from "@utils/notification";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
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

interface IAddSuggestionProps {
  isLocked;
  observationId;
  recoUpdated;
  recoVotesLength;
}

export default function AddSuggestion({
  isLocked,
  observationId,
  recoUpdated,
  recoVotesLength
}: IAddSuggestionProps) {
  const { t } = useTranslation();
  const scientificRef = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState([]);
  const [languages, setLanguages] = useState([]);
  const langRef = useRef(null);

  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });

  useEffect(() => {
    axGetLangList().then(({ data }) =>
      setLanguages(data.map((l) => ({ label: l.name, value: l.id })))
    );
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
      languageId: SITE_CONFIG.LANG.DEFAULT_ID
    }
  });

  const onCommonNameChange = ({ sLabel, sValue, lang, langId, groupId, updateScientific }) => {
    if (langId) {
      langRef.current.select.onChange({ value: langId, label: lang });
    }
    if ((sLabel || sValue) && updateScientific) {
      scientificRef.current.select.onChange({ value: sValue, label: sLabel, groupId });
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
    hForm.register({ name: "taxonScientificName" });
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
      notification(t("OBSERVATION.NO_EMPTY_SUGGESTION"));
    }
  };

  useEffect(() => {
    if (recoVotesLength) {
      onOpen();
    }
  }, [recoVotesLength]);

  return languages.length > 0 ? (
    isLocked ? (
      <Alert status="success">
        <AlertIcon /> {t("OBSERVATION.ID.VALIDATED")}
      </Alert>
    ) : (
      <>
        <Box className="fade" hidden={!isOpen}>
          <Collapse isOpen={isOpen}>
            <Box p={4}>
              <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
                <SimpleGrid columns={[1, 1, 3, 3]} spacing={4}>
                  <SelectAsync
                    name="taxonCommonName"
                    label={t("OBSERVATION.COMMON_NAME")}
                    style={{ gridColumn: "1/3" }}
                    onQuery={onCommonNameQuery}
                    options={commonNameOptions}
                    optionComponent={CommonNameOption}
                    placeholder={t("OBSERVATION.MIN_THREE_CHARS")}
                    onChange={onCommonNameChange}
                    form={hForm}
                  />
                  <Select
                    name="languageId"
                    label={t("OBSERVATION.LANGUAGE")}
                    options={languages}
                    form={hForm}
                    selectRef={langRef}
                  />
                </SimpleGrid>
                <SelectAsync
                  name="scientificNameTaxonId"
                  label={t("OBSERVATION.SCIENTIFIC_NAME")}
                  onQuery={onScientificNameQuery}
                  optionComponent={ScientificNameOption}
                  placeholder={t("OBSERVATION.MIN_THREE_CHARS")}
                  onChange={onScientificNameChange}
                  form={hForm}
                  selectRef={scientificRef}
                />
                <Submit leftIcon={<CheckIcon />} form={hForm}>
                  {t("OBSERVATION.SUGGEST")}
                </Submit>
              </form>
            </Box>
          </Collapse>
        </Box>
        <Alert className="fadeInUp" status="success" hidden={isOpen}>
          <AlertIcon />
          {t("OBSERVATION.ID.SUGGESTION_SUCCESS")}
          <Button variant="link" colorScheme="blue" onClick={onOpen} ml={1}>
            {t("OBSERVATION.ID.RESUGGEST")}
          </Button>
        </Alert>
      </>
    )
  ) : (
    <Skeleton height="294px" borderRadius={0} />
  );
}
