import { Image, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const doFilter = (data) => {
  const parsedData = parseObservationData(data);
  return data.length
    ? Object.keys(parsedData[0])
        .map((key) => [key, parsedData.some((d) => !!d[key])]) // tries to find truthy value for each key
        .filter(([, value]) => value) // filters out empty keys
        .map(([key]) => key) // returns only keys
    : [];
};

export const parseObservationData = (data) => {
  return data?.length > 0
    ? data.map(({ checklistAnnotation, ...others }) => {
        return { ...others, ...checklistAnnotation };
      })
    : [];
};

export const dataTableObservationRow = (data, speciesGroups, dataTable) => {
  const header = doFilter(data);
  const { t } = useTranslation();

  return header.map((item) => {
    switch (item) {
      case "id":
        return {
          Header:`${t("datatable.table.id")}`,
          accessor: "id",
          Cell: ({ value }) => (
            <a href={`/observation/show/${value}`}>
              <BlueLink> {value} </BlueLink>
            </a>
          )
        };
      case "scientificName":
        return {
          Header: `${t("datatable.table.scientificName")}`,
          accessor: "scientificName",
          Cell: ({ value }) => (
            <Text key={value} fontStyle="italic">
              {value}
            </Text>
          )
        };
      case "userInfo":
        return {
          Header:`${t("datatable.table.userInfo")}`,
          accessor: "userInfo",
          Cell: ({ value }) => (
            <a href={`/user/show/${value.id}`}>
              <Image
                borderRadius={50}
                title={value.name}
                boxSize="3rem"
                src={getUserImage(value.profilePic, value.name, 100)}
              />
            </a>
          )
        };
      case "sGroup":
        return {
          Header: `${t("datatable.table.sGroup")}`,
          accessor: "sGroup",
          Cell: ({ value }) => (
            <SpeciesGroupBox
              id={parseInt(value)}
              canEdit={false}
              speciesGroups={speciesGroups}
              observationId={dataTable?.id}
            />
          )
        };
      case "geoPrivacy":
        return {
          Header:`${t("datatable.table.geoPrivacy")}` ,
          accessor: "geoPrivacy",
          Cell: ({ value }) =>
            value ? <CheckIcon color="green.500" /> : <CrossIcon color="red.500" />
        };
      default:
        return {
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
          accessor: item
        };
    }
  });
};
