import { Collapse, SimpleGrid } from "@chakra-ui/core";
import CheckBox from "@components/form/checkbox";
import Select from "@components/form/select";
import SelectAsync from "@components/form/select-async";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { UseFormMethods } from "react-hook-form";

import { CommonNameOption, getCommonNameOption, onCommonNameQuery } from "./common-name";
import { onScientificNameQuery, ScientificNameOption } from "./scientific-name";

interface IRecodataProps {
  form: UseFormMethods<Record<string, any>>;
  languages;
}

export default function Recodata({ form, languages }: IRecodataProps) {
  const helpIdentify = form.watch("helpIdentify");

  const { t } = useTranslation();
  const scientificRef = useRef(null);
  const langRef = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState([]);

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

  useEffect(() => {
    form.register({ name: "taxonScientificName" });
  }, [form.register]);

  return (
    <>
      <CheckBox name="helpIdentify" label="Help Identify" form={form} />
      <Collapse in={!helpIdentify}>
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={4}>
          <SimpleGrid columns={[1, 1, 3, 3]} spacing={4}>
            <SelectAsync
              name="taxonCommonName"
              label={t("OBSERVATION.COMMON_NAME")}
              style={{ gridColumn: "1/3" }}
              disabled={helpIdentify}
              onQuery={onCommonNameQuery}
              options={commonNameOptions}
              optionComponent={CommonNameOption}
              placeholder={t("OBSERVATION.MIN_THREE_CHARS")}
              onChange={onCommonNameChange}
              form={form}
            />
            <Select
              name="obsvLanguageId"
              label={t("OBSERVATION.LANGUAGE")}
              options={languages}
              disabled={helpIdentify}
              form={form}
              selectRef={langRef}
            />
          </SimpleGrid>
          <SelectAsync
            name="scientificNameTaxonId"
            label={t("OBSERVATION.SCIENTIFIC_NAME")}
            disabled={helpIdentify}
            onQuery={onScientificNameQuery}
            optionComponent={ScientificNameOption}
            placeholder={t("OBSERVATION.MIN_THREE_CHARS")}
            onChange={onScientificNameChange}
            form={form}
            selectRef={scientificRef}
          />
        </SimpleGrid>
      </Collapse>
    </>
  );
}
