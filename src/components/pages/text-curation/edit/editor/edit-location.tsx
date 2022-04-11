import {
  Button,
  ButtonGroup,
  Divider,
  FormLabel,
  ModalFooter,
  Tag,
  TagLabel
} from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import useCurateEdit from "../use-curate-edit";

export default function EditLocation() {
  const { t } = useTranslation();
  const { rows } = useCurateEdit();
  const [name, suggestions] = useMemo(() => {
    const _suggestions = (rows.editing.row.locations || "")
      .split(",")
      .map((o) => o.trim())
      .filter((o) => !!o);

    return [rows.editing.name, Array.from(new Set(_suggestions))];
  }, [rows.editing]);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        [name]: Yup.string()
      })
    ),
    defaultValues: {
      [name]: rows.editing.row[name]
    }
  });

  const onTagSelect = (value) => hForm.setValue(name, value);

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
            <FormLabel>{t("text-curation:parsed.location")}</FormLabel>

            {suggestions.map((suggestion: any) => (
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

        <TextBoxField name={name} label={name} />

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
