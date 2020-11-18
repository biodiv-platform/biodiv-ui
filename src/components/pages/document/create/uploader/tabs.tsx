import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import { useIsMount } from "@hooks/use-is-mount";
import React, { useEffect, useState } from "react";

import useManageDocument from "./document-upload-provider";
import DocumentDropzone from "./dropzone";
import MyDocumentUploads from "./my-uploads";

export default function DocumentUploaderTabs({ onChange }) {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const { selectedDocument } = useManageDocument();
  const isMount = useIsMount();

  useEffect(() => {
    if (!isMount) {
      setTabIndex(0);
      onChange(selectedDocument);
    }
  }, [selectedDocument]);

  return (
    <Tabs index={tabIndex} onChange={setTabIndex} variant="soft-rounded" isLazy={true}>
      <TabList mb={4} overflowX="auto" py={1}>
        <Tab>✔️ {t("DOCUMENT.UPLOAD.SELECTED")}</Tab>
        <Tab>☁️ {t("DOCUMENT.UPLOAD.MY_UPLOADS")}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <DocumentDropzone />
        </TabPanel>
        <TabPanel p={0}>
          <MyDocumentUploads />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
