import { Text } from "@chakra-ui/react";
import AudioRecorder from "@components/@core/audio-recoarder";
import { getAssetObject } from "@utils/image";
import { nanoid } from "nanoid";
import useTranslation from "next-translate/useTranslation";
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
      <Text my={5}>ℹ️ {t("form:description.audio")}</Text>
      {audioFile ? (
        <AudioPlayer src={audioFileURL} onConfirm={onConfirm} onCancel={onCancel} />
      ) : (
        <AudioRecorder mediaRecorderOptions={{ bitsPerSecond: 500 }} onStop={onStop} />
      )}
    </div>
  );
}
