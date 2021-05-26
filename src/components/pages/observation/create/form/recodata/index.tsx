import { Collapse, SimpleGrid } from "@chakra-ui/react";
import { CheckboxField } from "@components/form/checkbox";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import useTranslation from "@hooks/use-translation";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { CommonNameOption, getCommonNameOption, onCommonNameQuery } from "./common-name";
import { onScientificNameQuery, ScientificNameOption } from "./scientific-name";

interface IRecodataProps {
  languages;
}

export default function Recodata({ languages }: IRecodataProps) {
  const form = useFormContext();
  const helpIdentify = form.watch("helpIdentify");

  const { t } = useTranslation();
  const scientificRef: any = useRef(null);
  const langRef: any = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState<any[]>([]);

  const onCommonNameChange = ({ sLabel, sValue, lang, langId, groupId, updateScientific }) => {
    if (langId) {
      langRef.current.select.onChange(
        { value: langId, label: lang },
        { name: langRef.current.select.props.inputId }
      );
    }
    if ((sLabel || sValue) && updateScientific) {
      scientificRef.current.select.onChange(
        { value: sValue, label: sLabel, groupId },
        { name: scientificRef.current.select.props.inputId }
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

  useEffect(() => {
    form.register("taxonScientificName");
  }, [form.register]);

  return (
    <>
      <CheckboxField name="helpIdentify" label="Help Identify" />
      <Collapse in={!helpIdentify} startingHeight={1} animateOpacity={true}>
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={4}>
          <SimpleGrid columns={[1, 1, 3, 3]} spacing={4}>
            <SelectAsyncInputField
              name="taxonCommonName"
              label={t("OBSERVATION.COMMON_NAME")}
              style={{ gridColumn: "1/3" }}
              disabled={helpIdentify}
              onQuery={onCommonNameQuery}
              options={commonNameOptions}
              optionComponent={CommonNameOption}
              placeholder={t("OBSERVATION.MIN_THREE_CHARS")}
              onChange={onCommonNameChange}
            />
            <SelectInputField
              name="obsvLanguageId"
              label={t("OBSERVATION.LANGUAGE")}
              options={languages}
              disabled={helpIdentify}
              shouldPortal={true}
              selectRef={langRef}
            />
          </SimpleGrid>
          <SelectAsyncInputField
            name="scientificNameTaxonId"
            label={t("OBSERVATION.SCIENTIFIC_NAME")}
            disabled={helpIdentify}
            onQuery={onScientificNameQuery}
            optionComponent={ScientificNameOption}
            placeholder={t("OBSERVATION.MIN_THREE_CHARS")}
            onChange={onScientificNameChange}
            selectRef={scientificRef}
          />
        </SimpleGrid>
      </Collapse>
    </>
  );
}
