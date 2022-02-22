import { SelectMultipleInputField } from "@components/form/select-multiple";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { axExtractAllParams } from "@services/extraction.service";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  sname: yup.array().required("its a required field")
});

export default function ColumnSelect({ availableColumns, filePath }) {
  const hForm = useForm({
    resolver: yupResolver(schema)
  });
  const [x, setX] = useState();

  const submitForm = async (dat) => {
    const payload = {
      ...dat,
      filePath: filePath
    };

    const { success } = await axExtractAllParams(payload);
    if (success) {
      setX(dat);
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
        <SubmitButton>Save</SubmitButton>
      </form>
      <p>{JSON.stringify(x)}</p>
    </FormProvider>
  );
}
