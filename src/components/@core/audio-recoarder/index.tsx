import { Box, Button } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React, { useEffect, useRef } from "react";
import { useTimer } from "use-timer";

const pad = (number) => number.toString().toString().padStart(2, "0");

export const secondsToMinutes = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${pad(minutes)}:${pad(seconds)}`;
};

interface IRecorderProps {
  mediaRecorderOptions: MediaRecorderOptions;
  onStop: (blob: Blob) => void;
  onPermissionDenied?: () => void;
  endTime?: number;
}

export default function AudioRecorder({
  onStop,
  onPermissionDenied,
  mediaRecorderOptions,
  endTime = 120
}: IRecorderProps) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const { time, start, reset, isRunning } = useTimer({ endTime });
  const { t } = useTranslation();

  const getMediaStream = async () => {
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
    } catch (e) {
      onPermissionDenied && onPermissionDenied();
      console.error(e);
    }
  };

  const onRecordingActive = ({ data }: BlobEvent) => {
    mediaChunks.current.push(data);
  };

  const onRecordingStop = () => {
    const blob = new Blob(mediaChunks.current, { type: "audio/wav" });
    onStop(blob);
  };

  const record = async () => {
    if (isRunning) {
      if (!mediaStream.current) {
        await getMediaStream();
      }
      if (mediaStream.current) {
        mediaRecorder.current = new MediaRecorder(mediaStream.current, mediaRecorderOptions);
        mediaRecorder.current.ondataavailable = onRecordingActive;
        mediaRecorder.current.onstop = onRecordingStop;
        mediaRecorder.current.onerror = console.error;
        mediaRecorder.current.start();
      }
    } else {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }
    }
  };

  useEffect(() => {
    record();
  }, [isRunning]);

  return (
    <div className="fade">
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        fontFamily="mono"
        fontSize="4xl"
        textAlign="center"
        w="8rem"
      >
        {secondsToMinutes(time)}
      </Box>
      <Button
        isDisabled={isRunning}
        leftIcon={"microphone" as any}
        mr={4}
        mt={4}
        onClick={start}
        type="button"
        variant="solid"
        variantColor="blue"
      >
        {t("OBSERVATION.AUDIO.START")}
      </Button>
      <Button
        isDisabled={!isRunning}
        leftIcon={"stop" as any}
        mt={4}
        onClick={reset}
        type="button"
        variant="solid"
        variantColor="red"
      >
        {t("OBSERVATION.AUDIO.STOP")}
      </Button>
    </div>
  );
}
