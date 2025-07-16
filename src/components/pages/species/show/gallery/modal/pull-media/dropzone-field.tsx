import { Tabs } from "@chakra-ui/react";
import AudioInput from "@components/pages/observation/create/form/uploader/audio-input";
import FromURL from "@components/pages/observation/create/form/uploader/from-url";
import MyUploads from "@components/pages/observation/create/form/uploader/my-uploads";
import ResourcesList from "@components/pages/observation/create/form/uploader/observation-resources/resources-list";
import useObservationCreate from "@components/pages/observation/create/form/uploader/use-observation-resources";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

import SpeciesPullMedia from ".";

interface ISpeciesDropzoneField {
  name: string;
  isCreate?: boolean;
  children?;
}

const SpeciesDropzoneField = ({ name }: ISpeciesDropzoneField) => {
  const { field, fieldState } = useController({ name });
  const { observationAssets, addAssets } = useObservationCreate();
  const [tabValue, setTabValue] = useState("selectedMedia");
  const { t } = useTranslation();

  useEffect(() => {
    field.onChange(observationAssets);
  }, [observationAssets]);

  const onSelectionDone = () => setTabValue("selectedMedia");

  return (
    <Field invalid={!!fieldState.error} minH="500px">
      <Tabs.Root
        className="nospace"
        value={tabValue}
        onValueChange={(e) => setTabValue(e.value)}
        variant={"subtle"}
        lazyMount={true}
      >
        <Tabs.List mb={4} overflowX="auto" py={1}>
          <Tabs.Trigger value="selectedMedia">✔️ {t("form:selected_media")}</Tabs.Trigger>
          <Tabs.Trigger value="pullMedia">🖼️ {t("species:pull_media")}</Tabs.Trigger>
          <Tabs.Trigger value="draftMedia">☁️ {t("form:my_uploads")}</Tabs.Trigger>
          <Tabs.Trigger value="audio">🎙️ {t("form:audio.title")}</Tabs.Trigger>
          <Tabs.Trigger value="youtube">📹 {t("form:from_url")}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="selectedMedia">
          <ResourcesList />
        </Tabs.Content>
        <Tabs.Content value="pullMedia">
          <SpeciesPullMedia onDone={onSelectionDone} />
        </Tabs.Content>
        <Tabs.Content value="draftMedia">
          <MyUploads onDone={onSelectionDone} />
        </Tabs.Content>
        <Tabs.Content value="audio">
          <AudioInput onDone={onSelectionDone} onSave={addAssets} />
        </Tabs.Content>
        <Tabs.Content value="youtube">
          <FromURL onDone={onSelectionDone} onSave={addAssets} />
        </Tabs.Content>
      </Tabs.Root>
      <Field errorText={JSON.stringify(fieldState?.error?.message)} />
    </Field>
  );
};

export default SpeciesDropzoneField;
