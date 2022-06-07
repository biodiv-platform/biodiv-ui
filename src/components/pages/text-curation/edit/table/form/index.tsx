import { Box, Heading } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import useCurateEdit from "../../use-curate-edit";
import { DATE_FORMAT_OPTIONS } from "../data";
import DateEdit from "./edit-date";
import LocationEdit from "./edit-location";
import EditStatus from "./edit-status";
import ScientificNameEdit from "./scientific-name";

export default function EditRowForm({ row }) {
  const { t } = useTranslation();
  const { rows } = useCurateEdit();
  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        curatedSName: Yup.string(),
        curatedLocation: Yup.string(),
        curatedDate: Yup.string(),
        curatedDateFormat: Yup.string(),
        curatedStatus: Yup.string().required()
      })
    ),
    defaultValues: {
      curatedSName: row.curatedSName
        ? { label: row.curatedSName, value: row.curatedSName }
        : undefined,
      curatedLocation: {
        label: row.curatedLocation,
        value: row.curatedLocation
      },
      curatedDate: row.curatedDate,
      curatedDateFormat: row.curatedDateFormat
        ? row.curatedDateFormat
        : DATE_FORMAT_OPTIONS[0].value,
      curatedStatus: row.curatedStatus,
      validatedStatus: row.validatedStatus
    }
  });

  const handleOnSubmit = (values) => {
    rows.update({
      ...row,
      ...values,
      curatedSName: values.curatedSName || ""
    });
    const btn: any = document.querySelector(`[data-testid=expander-button-${row.id}]`);
    btn.click();
  };

  return (
    <Box borderLeft="1px" borderColor="gray.200" h="full">
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <Box borderColor="gray.300" mb={4} borderWidth="thin">
            <Heading p={4} as="h3" size="sm" fontWeight="semibold" color="gray.500">
              Taxonomic Data
            </Heading>
            <ScientificNameEdit row={row} />
          </Box>

          <Box borderColor="gray.300" mb={4} borderWidth="thin">
            <Heading p={4} as="h3" size="sm" fontWeight="semibold" color="gray.500">
              Spatial Data
            </Heading>
            <LocationEdit row={row} />
          </Box>

          <Box borderColor="gray.300" mb={4} borderWidth="thin">
            <Heading p={4} as="h3" size="sm" fontWeight="semibold" color="gray.500">
              Temporal Data
            </Heading>
            <DateEdit row={row} />
          </Box>

          <Box borderColor="gray.300" mb={4} borderWidth="thin">
            <Heading p={4} as="h3" size="sm" fontWeight="semibold" color="gray.500">
              Curated Status
            </Heading>
            <EditStatus />
          </Box>
          <Box p={4}>
            <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
