import { Box } from "@chakra-ui/react";
import { useLocalRouter } from "@components/@core/local-link";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SelectMultipleInputField } from "@components/form/select-multiple";
import { SubmitButton } from "@components/form/submit-button";
import { TextBoxField } from "@components/form/text";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import { axExtractAllParams } from "@services/extraction.service";
import { axUserFilterSearch } from "@services/user.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
//import AsyncSelect from "react-select/async";
import * as yup from "yup";

import ToggleablePanel from "../common/toggleable-panel";

const schema = yup.object().shape({
  sname: yup.array().required("its a required field"),
  location: yup.array().required("its a required field"),
  date: yup.array().required("its a required field")
});

//const onQuery = debounce(axUserFilterSearch, 200);

export default function ColumnSelect({ availableColumns, filePath, userId }) {
  const router = useLocalRouter();

  const { t } = useTranslation();
  const hForm = useForm({
    resolver: yupResolver(schema)
  });
  const [x, setX] = useState();

  const submitForm = async (dat) => {
    const payload = {
      ...dat,
      filePath: filePath,
      userId: userId
    };

    /* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

    console.log(payload);

    const { success, data } = await axExtractAllParams(payload);

    if (success) {
      setX(dat);
      notification("Dataset uploaded successfully", NotificationType.Success);
      router.push(`/dataset/${data}/`, true);
    } else {
      notification("Unable to create dataset");
    }
  };

  const columnList = availableColumns.map((column) => ({ label: column, value: column }));
  //console.log(columnList);

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(submitForm)}>
        <SelectMultipleInputField
          name="sname"
          label=" Select scientific name column "
          options={columnList}
        />
        <SelectMultipleInputField
          name="location"
          label=" Select location column "
          options={columnList}
        />
        <SelectMultipleInputField name="date" label=" Select date column " options={columnList} />

        <ToggleablePanel icon="📃" title={"Metadata"}>
          <Box p={4} pb={0}>
            <TextBoxField name="title" label={t("form:title")} isRequired={true} />
            <TextAreaField
              name="summary"
              maxLength={255}
              label={"Dataset Description"}
              isRequired={true}
            />
          </Box>
        </ToggleablePanel>

        <SelectAsyncInputField
          name="contributors"
          label="contributors"
          multiple={true}
          onQuery={axUserFilterSearch}
        />

        <SubmitButton>Save</SubmitButton>
      </form>
      <p>{JSON.stringify(x)}</p>
    </FormProvider>
  );
}
