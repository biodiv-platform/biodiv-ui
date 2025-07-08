import { Tabs } from "@chakra-ui/react";
import useDidUpdateEffect from "@hooks/use-did-update-effect";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";

import { Field } from "@/components/ui/field";

import AudioInput from "./audio-input";
import FromURL from "./from-url";
import MyUploads from "./my-uploads";
import ResourcesList from "./observation-resources/resources-list";
import useObservationCreate from "./use-observation-resources";

export interface IDropzoneProps {
  name: string;
  mb?: number;
  isCreate?: boolean;
  children?;
  hidden?;
  onTabIndexChanged?;
}

const DropzoneField = ({ name, mb = 4, hidden, onTabIndexChanged }: IDropzoneProps) => {
  const { observationAssets, addAssets } = useObservationCreate();
  const [tab, setTab] = useState("selectedMedia");

  const { t } = useTranslation();

  const { field, fieldState } = useController({ name });

  useEffect(() => {
    observationAssets?.length && field.onChange(observationAssets);
  }, []);

  useEffect(() => {
    onTabIndexChanged && onTabIndexChanged(tab);
  }, [tab]);

  useDidUpdateEffect(() => {
    field.onChange(observationAssets);
  }, [observationAssets]);

  const onSelectionDone = () => setTab("selectedMedia");

  return (
    <Field
      hidden={hidden}
      invalid={!!fieldState.error}
      mb={mb}
      errorText={JSON.stringify(fieldState?.error?.message)}
    >
      <Tabs.Root
        className="nospace"
        onValueChange={(e) => setTab(e.value)}
        value={tab}
        lazyMount={true}
        width={"full"}
      >
        <Tabs.List mb={4} overflowX="auto" py={1}>
          <Tabs.Trigger value="selectedMedia" onClick={() => setTab("selectedMedia")}>
            ✔️ {t("form:selected_media")}
          </Tabs.Trigger>
          <Tabs.Trigger value="draftMedia" onClick={() => setTab("draftMedia")}>
            ☁️ {t("form:my_uploads")}
          </Tabs.Trigger>
          <Tabs.Trigger value="audio" onClick={() => setTab("audio")}>
            🎙️ {t("form:audio.title")}
          </Tabs.Trigger>
          <Tabs.Trigger value="youtube" onClick={() => setTab("youtube")}>
            📹 {t("form:from_url")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="selectedMedia">
          <ResourcesList showHint={true} />
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
    </Field>
  );
};

export default DropzoneField;
