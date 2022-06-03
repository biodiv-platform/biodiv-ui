import { Flex, Image } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  CommonNameOption,
  getCommonNameOption,
  onCommonNameQuery
} from "@components/pages/observation/create/form/recodata/common-name";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { components } from "react-select";

import useObservationCreate2 from "../../use-observation-create2-hook";

export const SpeciesGroupOption = ({ children, ...props }: any) => (
  <components.Option {...props}>
    <Flex alignItems="center" gap={2}>
      <Image boxSize="2rem" src={props.data.image} fallbackSrc={props.data.group} />
      <div>{children}</div>
    </Flex>
  </components.Option>
);

export default function Recodata({ index }) {
  const { t } = useTranslation();
  const { speciesGroupOptions } = useObservationCreate2();
  const form = useFormContext();

  const scientificRef: any = useRef(null);
  const commonRef: any = useRef(null);
  const [commonNameOptions, setCommonNameOptions] = useState<any[]>([]);

  const onCommonNameChange = ({ sLabel, sValue, lang, langId, groupId, updateScientific }) => {
    if (langId) {
      form.setValue(`o.${index}.obsvLanguageId`, { value: langId, label: lang });
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
      form.setValue(`o.${index}.scientificNameTaxonId`, null);
    }
    form.setValue(`o.${index}.taxonScientificName`, label);
    if (groupId) {
      if (raw?.common_names) {
        setCommonNameOptions(raw.common_names.map((cn) => getCommonNameOption(cn, raw, false)));
      }

      form.setValue(`o.${index}.sGroup`, groupId);
    }
  };

  const v = form.watch(`o.${index}.tmp`);

  useEffect(() => {
    if (!v) return;

    if (v.sci?.label)
      scientificRef.current.onChange(v.sci, { name: scientificRef.current.props.inputId });

    if (v.com?.label) commonRef.current.onChange(v.com, { name: commonRef.current.props.inputId });

    form.setValue(`o.${index}.tmp`, undefined);
  }, [v]);

  return (
    <>
      <SelectAsyncInputField
        mb={2}
        name={`o.${index}.taxonCommonName`}
        onChange={onCommonNameChange}
        onQuery={onCommonNameQuery}
        optionComponent={CommonNameOption}
        options={commonNameOptions}
        placeholder={t("observation:common_name")}
        resetOnSubmit={false}
        selectRef={commonRef}
        style={{ gridColumn: "1/3" }}
      />
      <SelectAsyncInputField
        mb={2}
        name={`o.${index}.scientificNameTaxonId`}
        onChange={onScientificNameChange}
        onQuery={onScientificNameQuery}
        optionComponent={ScientificNameOption}
        placeholder={t("observation:scientific_name")}
        resetOnSubmit={false}
        selectRef={scientificRef}
      />
      <SelectInputField
        isControlled={true}
        mb={2}
        name={`o.${index}.sGroup`}
        optionComponent={SpeciesGroupOption}
        options={speciesGroupOptions}
        placeholder={t("form:species_groups")}
        shouldPortal={true}
      />
    </>
  );
}
