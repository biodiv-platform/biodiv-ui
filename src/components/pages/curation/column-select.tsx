import { Button, Heading, Select, VStack } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectMultipleInputField } from "@components/form/select-multiple";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { axExtractAllParams } from "@services/extraction.service";
/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

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
      filePath:filePath
    };

    console.log(dat)
    const { success, data } = await axExtractAllParams(payload);
    if (success) {
      console.log("here is the data=", data);
    }
    setX(dat);
    //call an api
  };
  /*const a = [
    { label: "something1", value: "somevalue1" },
    { label: "something2", value: "somevalue2" },
    { label: "something3", value: "somevalue3" }
  ];*/

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
