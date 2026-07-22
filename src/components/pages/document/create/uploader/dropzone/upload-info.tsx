import { Button, FileUpload, Heading, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";

export default function UploadInfo() {
  const { t } = useTranslation();

  return (
    <>
      <div className="fade">
        <Heading size="md">{t("document:upload.label")}</Heading>
        <Text my={2} color="gray.500">
          {t("common:or")}
        </Text>
        <FileUpload.Trigger asChild>
          <Button colorPalette="blue" variant="outline">
            {t("form:uploader.browse")}
          </Button>
        </FileUpload.Trigger>
      </div>
      <Text my={2} color="gray.500">
        {t("document:upload.supported_formats")}
      </Text>
    </>
  );
}
