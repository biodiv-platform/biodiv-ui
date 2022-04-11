import {
  Button,
  ButtonGroup,
  Divider,
  FormLabel,
  ModalFooter,
  Tag,
  TagLabel
} from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import useCurateEdit from "../use-curate-edit";

export default function EditScientificName() {
  const { t } = useTranslation();
  const { rows } = useCurateEdit();
  const scientificRef: any = useRef(null);
  const [name, defaultValue, suggestions] = useMemo(() => {
    const _suggestions = `${rows.editing.row.scientificNamesFlashtext || ""},${
      rows.editing.row.scientificNamesGNRD || ""
    }`
      .split(",")
      .map((o) => o.trim())
      .filter((o) => !!o);

    return [rows.editing.name, rows.editing.row[name], Array.from(new Set(_suggestions))];
  }, [rows.editing]);

  const onQuery = async (q) => await onScientificNameQuery(q, "name");

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        [name]: Yup.string()
      })
    ),
    defaultValues: {
      [name]: defaultValue ? { label: defaultValue, value: defaultValue } : undefined
    }
  });

  const onTagSelect = (value) => {
    scientificRef.current.onChange(
      { value: value, label: value },
      { name: scientificRef.current.props.inputId }
    );
  };

  const handleOnSubmit = (values) => {
    rows.update({
      ...rows.editing.row,
      ...values
    });
    rows.clearEditing();
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        {suggestions.length > 0 && (
          <>
            <FormLabel>{t("text-curation:parsed.sci_name")}</FormLabel>

            {suggestions.map((suggestion) => (
              <Tag size="lg" key={suggestion} variant="subtle" colorScheme="cyan" mb={2} mr={2}>
                <TagLabel>
                  <Button variant="link" colorScheme="blue" onClick={() => onTagSelect(suggestion)}>
                    {suggestion}
                  </Button>
                </TagLabel>
              </Tag>
            ))}

            <Divider my={4} />
          </>
        )}

        <SelectAsyncInputField
          name={name}
          placeholder={t("observation:scientific_name")}
          onQuery={onQuery}
          optionComponent={ScientificNameOption}
          selectRef={scientificRef}
          isRaw={true}
        />

        <ModalFooter px={0}>
          <ButtonGroup>
            <Button variant="ghost" onClick={rows.clearEditing}>
              {t("common:cancel")}
            </Button>
            <SubmitButton>{t("common:save")}</SubmitButton>
          </ButtonGroup>
        </ModalFooter>
      </form>
    </FormProvider>
  );
}
