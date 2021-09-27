import { Image, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import ScientificName from "@components/@core/scientific-name";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import { getUserImage } from "@utils/media";
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

  return header.map((item) => {
    switch (item) {
      case "id":
        return {
          Header: "datatable:table.id",
          accessor: "id",
          Cell: ({ value }) => (
            <a href={`/observation/show/${value}`}>
              <BlueLink> {value} </BlueLink>
            </a>
          )
        };
      case "scientificName":
        return {
          Header: "datatable:table.scientific_name",
          accessor: "scientificName",
          Cell: ({ value }) => (
            <Text key={value}>
              <ScientificName value={value} />
            </Text>
          )
        };
      case "userInfo":
        return {
          Header: "datatable:table.user_info",
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
          Header: "datatable:table.s_group",
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
          Header: "datatable:table.geo_privacy",
          accessor: "geoPrivacy",
          Cell: ({ value }) =>
            value ? <CheckIcon color="green.500" /> : <CrossIcon color="red.500" />
        };
      case "observedAt":
        return {
          Header: "datatable:table.observed_at",
          accessor: "observedAt",
        }
      default:
        return {
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
          accessor: item
        };
    }
  });
};
