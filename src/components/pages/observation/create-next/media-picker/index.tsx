import { Tabs } from "@chakra-ui/react";
import { OBSERVATION_IMPORT_DIALOUGE } from "@static/events";
import { clusterResources } from "@utils/observation";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { emit } from "react-gbus";
import { useFormContext } from "react-hook-form";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import AudioInput from "../../create/form/uploader/audio-input";
import FromURL from "../../create/form/uploader/from-url";
import useObservationCreateNext from "../use-observation-create-next-hook";
import DraftMedia from "./draft-media";

export function MediaPicker({ onBrowse }) {
  const { setShowMediaPicker, showMediaPicker, draft, media } = useObservationCreateNext();
  const [tabIndex, setTabIndex] = useState("draftMedia");

  const { t } = useTranslation();
  const form = useFormContext();

  const onClose = () => setShowMediaPicker(false);

  useEffect(() => {
    if (showMediaPicker) {
      const observations = form.getValues("o");

      const disabledHKs: string[] = [];
      for (const obs of observations) {
        disabledHKs.push(...obs.resources.map((r: any) => r.hashKey));
      }
      media.setDisabledKeys(disabledHKs);

      media.setKeys([]);
      draft.get();
    }
  }, [showMediaPicker, draft.sortBy]);

  const handleOnImport = () => {
    emit(OBSERVATION_IMPORT_DIALOUGE, clusterResources(media.selected));
    setShowMediaPicker(false);
  };

  const onSelectionDone = () => setTabIndex("draftMedia");

  return (
    <DialogRoot
      open={showMediaPicker}
      onOpenChange={onClose}
      id="media-picker"
      size="xl"
      closeOnInteractOutside={true}
      modal={false}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader fontSize={"2xl"} fontWeight={"bold"}>
          🖼 {t("observation:media_picker")}
        </DialogHeader>
        <DialogCloseTrigger />
        <DialogBody pb={6}>
          <Tabs.Root className="nospace" defaultValue={tabIndex} lazyMount={true}>
            <Tabs.List mb={2} overflowX="auto" py={1}>
              <Tabs.Trigger value="draftMedia">☁️ {t("form:my_uploads")}</Tabs.Trigger>
              <Tabs.Trigger value="audio">🎙️ {t("form:audio.title")}</Tabs.Trigger>
              <Tabs.Trigger value="youtube">📹 {t("form:from_url")}</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="draftMedia">
              <DraftMedia onBrowse={onBrowse} onImport={handleOnImport} />
            </Tabs.Content>
            <Tabs.Content value="audio">
              <AudioInput onDone={onSelectionDone} onSave={draft.add} />
            </Tabs.Content>
            <Tabs.Content value="youtube">
              <FromURL onDone={onSelectionDone} onSave={draft.add} />
            </Tabs.Content>
          </Tabs.Root>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
