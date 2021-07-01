import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useIsMount } from "@hooks/use-is-mount";
import useTranslation from "next-translate/useTranslation";
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
    <Tabs
      className="nospace"
      index={tabIndex}
      onChange={setTabIndex}
      variant="soft-rounded"
      isLazy={true}
    >
      <TabList mb={4} overflowX="auto" py={1}>
        <Tab>✔️ {t("document:upload.selected")}</Tab>
        <Tab>☁️ {t("document:upload.my_uploads")}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <DocumentDropzone />
        </TabPanel>
        <TabPanel>
          <MyDocumentUploads />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
