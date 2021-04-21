import { Button, Heading, Text } from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DropTargetBox = styled.div`
  border: 2px dashed var(--gray-300);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > div {
    text-align: center;
  }
  &[data-dropping="true"] {
    border-color: var(--blue-500);
  }
  &[data-has-resources="false"] {
    grid-column: 1/6;
  }

  svg {
    display: block;
    font-size: 2.5rem;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
`;

const accept = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel"
];

const sheetJson = [
  {
    id: "13226105",
    observed_on: "6/7/18",
    url: "https://www.inaturalist.org/observations/13226105",
    tag_list: "Makunda Christian Hospital, Makunda Dragonflies, Forest fulvous skimmer",
    place_name: "makunda christian leprosy and general hospital",
    Notes:"",
    latitude: "24.434169",
    longitude: "92.330067",
    scientific_name: "Neurothemis fulvia",
    common_name: "Russet Percher",
    iconic_taxon_name: "Arthropods",
    filename: "1528449296.jpg",
    user: "4",
    license: "CC-BY-NC"
  },
  {
    id: "14475377",
    observed_on: "6/13/18",
    url: "https://www.inaturalist.org/observations/14475377",
    tag_list:
      "Greater Bluewing, Makunda Christian Hospital, Makunda Dragonflies, Rhyothemis plutonia",
    Notes: "Makunda dragonfly",
    place_name: "Makunda Christian Leprosy and General Hospital Rd, Assam, India",
    latitude: "24.434255",
    longitude: "92.327951",
    scientific_name: "Rhyothemis plutonia",
    common_name: "Greater Bluewing",
    iconic_taxon_name: "Arthropods",
    filename: "1531915773.jpg",
    user: "4",
    license: "CC-BY-NC"
  },
  {
    id: "14475404",
    observed_on: "5/29/18",
    url: "https://www.inaturalist.org/observations/14475404",
    tag_list: "Makunda Christian Hospital, Makunda Dragonflies, Pseudothemis zonata",
    Notes: "Makunda Dragonfly",
    place_name: "Makunda Christian Leprosy and General Hospital Rd, Assam, India",
    latitude: "24.424896",
    longitude: "92.338424",
    scientific_name: "Pseudothemis zonata",
    common_name: "Pied Skimmer",
    iconic_taxon_name: "Arthropods",
    filename: "1531915925.jpg",
    user: "4",
    license: "CC-BY-NC"
  }
];

interface userGroupDropTarget {
  setValue;
  setFieldMapping;
  simpleUpload?: boolean;
}

export default function DropTarget({ setValue, simpleUpload,setFieldMapping }: userGroupDropTarget) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();

  const onDrop = async () => {
    setIsProcessing(true);
    // if (files.length) {
    //   const { success, data } = await axUploadObservationResource(files[0]);
    //   if (success) {
    //     setValue(data);
    //   }
    // }

    // const reader = new FileReader();
    // reader.onload = function (e) {
    //   const readedData = XLSX.read(e?.target?.result, { type: "binary" });
    //   const wsname = readedData.SheetNames[0];
    //   const ws = readedData.Sheets[wsname];

    //   /* Convert array to json*/
    //   const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
    //   setValue(dataParse);
    // };
    // reader.readAsBinaryString(e?.target?.files[0]);
    setFieldMapping(sheetJson);
    setValue("/filename/path")

    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop
  });

  return (
    <DropTargetBox
      style={{ minHeight: simpleUpload ? "6rem" : "13rem" }}
      {...getRootProps()}
      data-dropping={isDragActive}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="fade">
          <TimeIcon />
          <span>{t("OBSERVATION.UPLOADER.PROCESSING")}</span>
        </div>
      ) : simpleUpload ? (
        <Button colorScheme="blue" variant="outline" children={t("OBSERVATION.UPLOADER.UPLOAD")} />
      ) : (
        <div className="fade">
          <Heading size="md">{t("OBSERVATION.UPLOADER.LABEL")}</Heading>
          <Text my={2} color="gray.500">
            {t("OR")}
          </Text>
          <Button
            colorScheme="blue"
            variant="outline"
            children={t("OBSERVATION.UPLOADER.BROWSE")}
          />
        </div>
      )}
    </DropTargetBox>
  );
}
