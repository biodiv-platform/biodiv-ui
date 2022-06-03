import { SimpleGrid } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  CommonNameOption,
  getCommonNameOption,
  onCommonNameQuery
} from "../../create/form/recodata/common-name";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "../../create/form/recodata/scientific-name";
import useObservationCreate2 from "../use-observation-create2-hook";

export default function RecoInputs() {
  const form = useFormContext();

  const { t } = useTranslation();
  const scientificRef: any = useRef(null);
  const commonRef: any = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState<any[]>([]);
  const { licensesList } = useObservationCreate2();

  const onCommonNameChange = ({ sLabel, sValue, lang, langId, groupId, updateScientific }) => {
    if (langId) {
      form.setValue("obsvLanguageId", { value: langId, label: lang });
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
      form.setValue("scientificNameTaxonId", null);
    }
    form.setValue("taxonScientificName", label);
    if (groupId) {
      if (raw?.common_names) {
        setCommonNameOptions(raw.common_names.map((cn) => getCommonNameOption(cn, raw, false)));
      }

      form.setValue("sGroup", groupId);
    }
  };

  const v = form.watch("tmp");

  useEffect(() => {
    if (!v) return;

    if (v.sci?.label)
      scientificRef.current.onChange(v.sci, { name: scientificRef.current.props.inputId });

    if (v.com?.label) commonRef.current.onChange(v.com, { name: commonRef.current.props.inputId });

    form.setValue("tmp", undefined);
  }, [v]);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
      <SelectAsyncInputField
        name="taxonCommonName"
        label={t("observation:common_name")}
        placeholder={t("observation:common_name")}
        onQuery={onCommonNameQuery}
        options={commonNameOptions}
        optionComponent={CommonNameOption}
        onChange={onCommonNameChange}
        selectRef={commonRef}
        mb={2}
      />
      <SelectAsyncInputField
        name="scientificNameTaxonId"
        label={t("observation:scientific_name")}
        placeholder={t("observation:scientific_name")}
        onQuery={onScientificNameQuery}
        optionComponent={ScientificNameOption}
        onChange={onScientificNameChange}
        selectRef={scientificRef}
        mb={2}
      />
      <SelectInputField
        mb={2}
        label={t("observation:license")}
        name="license"
        options={licensesList}
        shouldPortal={true}
      />
    </SimpleGrid>
  );
}
