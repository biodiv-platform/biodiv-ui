import { Box, Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import React from "react";

const AudioControl = styled.audio`
  width: 100%;
  &::-webkit-media-controls-panel {
    background-color: white;
    border-radius: 0;
  }
`;

export default function AudioPlayer({ src, onConfirm, onCancel }) {
  const { t } = useTranslation();

  return (
    <div className="fade">
      <Box maxW="24rem" bg="white" borderRadius="md" border="1px solid" borderColor="gray.300">
        <AudioControl controls={true} autoPlay={false}>
          <source src={src} type="audio/wav" />
        </AudioControl>
      </Box>
      <Button type="button" variantColor="blue" onClick={onConfirm} leftIcon="check" mr={4} mt={4}>
        {t("OBSERVATION.USE_IN_OBSERVATION")}
      </Button>
      <Button type="button" mt={4} onClick={onCancel}>
        {t("CANCEL")}
      </Button>
    </div>
  );
}
