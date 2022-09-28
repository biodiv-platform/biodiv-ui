import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import { OBSERVATION_IMPORT_DIALOUGE } from "@static/events";
import { clusterResources } from "@utils/observation";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { emit } from "react-gbus";
import { useFormContext } from "react-hook-form";

import AudioInput from "../../create/form/uploader/audio-input";
import FromURL from "../../create/form/uploader/from-url";
import useObservationCreateNext from "../use-observation-create-next-hook";
import DraftMedia from "./draft-media";

export function MediaPicker({ onBrowse }) {
  const { setShowMediaPicker, showMediaPicker, draft, media } = useObservationCreateNext();
  const [tabIndex, setTabIndex] = useState(0);
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

  const onSelectionDone = () => setTabIndex(0);

  return (
    <Modal isOpen={showMediaPicker} onClose={onClose} id="media-picker" size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>🖼 {t("observation:media_picker")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs
            className="nospace"
            index={tabIndex}
            isLazy={true}
            onChange={setTabIndex}
            variant="soft-rounded"
          >
            <TabList mb={2} overflowX="auto" py={1}>
              <Tab>☁️ {t("form:my_uploads")}</Tab>
              <Tab>🎙️ {t("form:audio.title")}</Tab>
              <Tab>📹 {t("form:from_url")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DraftMedia onBrowse={onBrowse} onImport={handleOnImport} />
              </TabPanel>
              <TabPanel>
                <AudioInput onDone={onSelectionDone} onSave={draft.add} />
              </TabPanel>
              <TabPanel>
                <FromURL onDone={onSelectionDone} onSave={draft.add} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
