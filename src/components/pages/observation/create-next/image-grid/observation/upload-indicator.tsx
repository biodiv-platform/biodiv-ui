import { AbsoluteCenter, Box, Button, Flex, ProgressCircle, Spinner } from "@chakra-ui/react";
import { AssetStatus } from "@interfaces/custom";
import useTranslation from "next-translate/useTranslation";
import { LuCircleAlert } from "react-icons/lu";

import useObservationCreateNext from "../../use-observation-create-next-hook";

export default function ResourceUploadIndicator({ children, hidden, failed, progress }) {
  const { t } = useTranslation();
  const { media } = useObservationCreateNext();

  const handleOnRetryFailed = () => media.sync(AssetStatus.Failed);

  if (hidden && !failed) return null;

  return (
    <Box position="absolute" top={0} left={0} p={2}>
      {failed ? (
        <Button size="xs" colorPalette="red" variant="solid" onClick={handleOnRetryFailed}>
          <LuCircleAlert />
          {failed}
        </Button>
      ) : (
        <Flex
          px={2}
          py={0.5}
          alignItems="center"
          fontSize="sm"
          bg="gray.200"
          cursor="pointer"
          borderRadius="md"
          gap={1}
          title={`${t("observation:sync.uploading")}${progress != null ? ` (${progress}%)` : ""}`}
        >
          {progress != null ? (
            <ProgressCircle.Root className="icon" size="sm" value={progress} colorPalette="blue">
              <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
              </ProgressCircle.Circle>
              <AbsoluteCenter>
                <ProgressCircle.ValueText fontSize="0.55rem">{progress}%</ProgressCircle.ValueText>
              </AbsoluteCenter>
            </ProgressCircle.Root>
          ) : (
            <Spinner size="xs" />
          )}
          {children}
        </Flex>
      )}
    </Box>
  );
}
