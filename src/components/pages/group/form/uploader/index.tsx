import { SimpleGrid } from "@chakra-ui/core";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import ResourceCard from "./imageCard";
import { ObservationCreateProvider } from "@components/pages/observation/create/form/uploader/use-observation-resources";
import { FormContextValues } from "react-hook-form";
import { DB_CONFIG } from "@static/observation-create";
import IndexedDBProvider from "use-indexeddb";
const DropTarget = dynamic(
  import("../../../observation/create/form/uploader/observation-resources/drop-target"),
  { ssr: false }
);
export interface IDropzoneProps {
  name: string;
  mb?: number;
  form: FormContextValues<any>;
  isCreate?: boolean;
  children?;
}

function IconUploader({ form, name }) {
  const { observationAssets } = useObservationCreate();
  useEffect(() => {
    form.register({ name });
    if (observationAssets.length > 0) {
      form.setValue();
    }
  }, [form.register]);

  useEffect(() => {
    if (observationAssets.length > 0) {
      form.setValue(name, observationAssets[0].path);
    }
  }, [observationAssets]);

  return (
    <SimpleGrid borderRadius="lg" columns={[1, 3, 4, 5]} spacing={4}>
      {observationAssets &&
        observationAssets.map((r, index) => (
          <ResourceCard resource={r} key={r.hashKey || index} index={index} />
        ))}
      {observationAssets.length <= 0 && <DropTarget assetsSize={observationAssets?.length} />}
    </SimpleGrid>
  );
}

export default function GroupIconUploader(props: IDropzoneProps) {
  const { name, form } = props;
  return (
    <IndexedDBProvider config={DB_CONFIG} loading="Loading...">
      <ObservationCreateProvider
        observationAssets={props.form.control.defaultValuesRef.current[props.name]}
      >
        <IconUploader name={name} form={form} />
      </ObservationCreateProvider>
    </IndexedDBProvider>
  );
}
