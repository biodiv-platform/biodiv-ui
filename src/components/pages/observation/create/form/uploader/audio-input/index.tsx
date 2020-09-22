import { Text } from "@chakra-ui/core";
import AudioRecorder from "@components/@core/audio-recoarder";
import useTranslation from "@hooks/use-translation";
import { getAssetObject } from "@utils/image";
import { nanoid } from "nanoid";
import React, { useState } from "react";

import useObservationCreate from "../use-observation-resources";
import AudioPlayer from "./audio-player";

export default function AudioInput({ onDone }) {
  const { t } = useTranslation();
  const { addAssets } = useObservationCreate();
  const [audioFile, setAudioFile] = useState<File>();
  const [audioFileURL, setAudioFileURL] = useState<string>();

  const onStop = (blob) => {
    setAudioFile(
      new File([blob], `${nanoid()}.wav`, {
        type: blob.type,
        lastModified: Date.now()
      })
    );
    setAudioFileURL(URL.createObjectURL(blob));
  };

  const onConfirm = () => {
    addAssets([getAssetObject(audioFile)], true);
    setAudioFile(undefined);
    onDone();
  };

  const onCancel = () => setAudioFile(undefined);

  return (
    <div>
      <Text my={5}>ℹ️ {t("OBSERVATION.DESCRIPTION.AUDIO")}</Text>
      {audioFile ? (
        <AudioPlayer src={audioFileURL} onConfirm={onConfirm} onCancel={onCancel} />
      ) : (
        <AudioRecorder mediaRecorderOptions={{ bitsPerSecond: 500 }} onStop={onStop} />
      )}
    </div>
  );
}
