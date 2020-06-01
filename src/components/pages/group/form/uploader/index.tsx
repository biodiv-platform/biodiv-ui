import { SimpleGrid } from "@chakra-ui/core";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import ResourceCard from "./imageCard";
import { FormContextValues } from "react-hook-form";
const DropTarget = dynamic(import("./IconUploader"), { ssr: false });
export interface IDropzoneProps {
  name: string;
  mb?: number;
  form: FormContextValues<any>;
  isCreate?: boolean;
  children?;
}

function IconUploader({ form, name }) {
  const { observationAssets } = useObservationCreate();
  const [value, setvalue] = useState(null);
  useEffect(() => {
    form.register({ name });
    if (value) {
      form.setValue(name, value.path);
    }
  }, [form.register]);

  useEffect(() => {
    if (value) {
      form.setValue(name, value.path);
    }
  }, [value]);

  return (
    <SimpleGrid borderRadius="lg" columns={[1, 3, 4, 5]} spacing={4}>
      {value ? (
        <ResourceCard setValue={setvalue} resource={value.blob} key={value.hashKey} />
      ) : (
        <DropTarget setValue={setvalue} assetsSize={observationAssets?.length} />
      )}
    </SimpleGrid>
  );
}

export default function GroupIconUploader(props: IDropzoneProps) {
  const { name, form } = props;
  return <IconUploader name={name} form={form} />;
}
