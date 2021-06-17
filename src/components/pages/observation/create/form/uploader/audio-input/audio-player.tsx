import { Box, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import CheckIcon from "@icons/check";
import useTranslation from "next-translate/useTranslation";
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
      <Button
        type="button"
        colorScheme="blue"
        onClick={onConfirm}
        leftIcon={<CheckIcon />}
        mr={4}
        mt={4}
      >
        {t("form:use_in_observation")}
      </Button>
      <Button type="button" mt={4} onClick={onCancel}>
        {t("common:cancel")}
      </Button>
    </div>
  );
}
