import { Tabs } from "@chakra-ui/react";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import ResourcesList from "@components/pages/observation/create/form/uploader/observation-resources/resources-list";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

export interface IDropzoneProps {
  name: string;
  mb?: number;
  isCreate?: boolean;
  children?;
}

const DropzoneField = ({ name, mb = 4 }: IDropzoneProps) => {
  const { field, fieldState } = useController({ name });
  const { observationAssets } = useObservationCreate();
  const { t } = useTranslation();

  useEffect(() => {
    field.onChange(observationAssets);
  }, [observationAssets]);

  const [tabValue, setTabValue] = useState("selectedMedia");
  const onSelectionDone = () => setTabValue("selectedMedia");

  return (
    <Field
      invalid={!!fieldState.error}
      mb={mb}
      errorText={JSON.stringify(fieldState?.error?.message)}
    >
      <Tabs.Root className="nospace" defaultValue={tabValue} lazyMount={true}>
        <Tabs.List mb={4} overflowX="auto" py={1}>
          <Tabs.Trigger value="selectedMedia">✔️ {t("form:selected_media")}</Tabs.Trigger>
          <Tabs.Trigger value="draftMedia">☁️ {t("form:my_uploads")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="selectedMedia">
          <ResourcesList showHint={true} />
        </Tabs.Content>
        <Tabs.Content value="draftMedia">
          <MyUploads onDone={onSelectionDone} />
        </Tabs.Content>
      </Tabs.Root>
    </Field>
  );
};

export default DropzoneField;
