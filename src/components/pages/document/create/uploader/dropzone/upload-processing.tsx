import { AbsoluteCenter, Flex, ProgressCircle } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { LuClock } from "react-icons/lu";

export default function UploadProcessing({ progress }: { progress?: number }) {
  const { t } = useTranslation();

  return (
    <Flex direction="column" alignItems="center" className="fade">
      {progress != null ? (
        <ProgressCircle.Root size="lg" value={progress} colorPalette="blue">
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
          <AbsoluteCenter>
            <ProgressCircle.ValueText fontSize="0.7rem">{progress}%</ProgressCircle.ValueText>
          </AbsoluteCenter>
        </ProgressCircle.Root>
      ) : (
        <LuClock fontSize="3xl" />
      )}
      <span>{t("form:uploader.processing")}</span>
    </Flex>
  );
}
