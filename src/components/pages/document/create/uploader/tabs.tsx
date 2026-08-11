import { Badge, Tabs } from "@chakra-ui/react";
import { useIsMount } from "@hooks/use-is-mount";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";

import ExternalUrl from "../resource-url";
import useManageDocument from "./document-upload-provider";
import DocumentDropzone from "./dropzone";
import MyDocumentUploads from "./my-uploads";

export default function DocumentUploaderTabs({ onChange, externalUrl }) {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(externalUrl ? "externalUrl" : "selectedDocument");
  const { selectedDocument, documentList } = useManageDocument();
  const isMount = useIsMount();

  useEffect(() => {
    if (!isMount) {
      setTabIndex("selectedDocument");
      onChange(selectedDocument);
    }
  }, [selectedDocument]);

  return (
    <Tabs.Root className="nospace" defaultValue={tabIndex} lazyMount={true} width={"full"}>
      <Tabs.List mb={4} overflowX="auto" py={1}>
        <Tabs.Trigger value="selectedDocument" disabled={externalUrl}>
          ✔️ {t("document:upload.selected")}
        </Tabs.Trigger>
        <Tabs.Trigger value="draftmedia" disabled={externalUrl}>
          ☁️ {t("document:upload.my_uploads")}
          {(documentList ?? []).length > 0 && (
            <Badge variant="solid" colorPalette="red" borderRadius="full">
              {(documentList ?? []).length}
            </Badge>
          )}
        </Tabs.Trigger>
        <Tabs.Trigger value="externalUrl">🌎{t("document:upload.url")}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="selectedDocument">
        <DocumentDropzone />
      </Tabs.Content>
      <Tabs.Content value="draftmedia">
        <MyDocumentUploads />
      </Tabs.Content>
      <Tabs.Content value="externalUrl">
        <ExternalUrl />
      </Tabs.Content>
    </Tabs.Root>
  );
}
