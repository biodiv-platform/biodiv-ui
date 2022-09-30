import { WarningIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { AssetStatus } from "@interfaces/custom";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import useObservationCreateNext from "../../use-observation-create-next-hook";

export default function ResourceUploadIndicator({ children, hidden, failed }) {
  const { t } = useTranslation();
  const { media } = useObservationCreateNext();

  const handleOnRetryFailed = () => media.sync(AssetStatus.Failed);

  if (hidden && !failed) return null;

  return (
    <Box position="absolute" top={0} left={0} p={2}>
      {failed ? (
        <Button
          size="xs"
          colorScheme="red"
          variant="solid"
          leftIcon={<WarningIcon />}
          onClick={handleOnRetryFailed}
        >
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
          title={t("observation:sync.uploading")}
        >
          <Spinner size="xs" />
          {children}
        </Flex>
      )}
    </Box>
  );
}
