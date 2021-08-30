import { Button, Image, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import DownloadIcon from "@icons/download";
import { ENDPOINT } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { formatDate } from "@utils/date";
import { getUserImage } from "@utils/media";
import { stripSpecialCharacters } from "@utils/text";
import React from "react";

const doFilter = (data) => {
  if (data[0]) {
    const { params, status, id, filterUrl, ...others } = data[0];
    return data.length ? Object.keys({ ...others }) : [];
  }
};

export const downloadLogsRow = (data, downloadLabel, unknown) => {
  const header = doFilter(data);

  return header?.map((item) => {
    switch (item) {
      case "sourceType":
        return {
          Header: "Source",
          accessor: "sourceType",
          Cell: ({ row }) => (
            <a href={`${data[row.index].filterUrl}`}>
              <BlueLink> {row.values.sourceType || unknown} </BlueLink>
            </a>
          )
        };
      case "user":
        return {
          Header: stripSpecialCharacters(item),
          accessor: "user",
          Cell: ({ value }) => (
            <a href={`/user/show/${value.id}`}>
              <Image
                borderRadius={50}
                title={value.name}
                boxSize="3rem"
                fallbackSrc={`/api/avatar?t=${value.name}&s=${100}`}
                src={getUserImage(value.profilePic, value.name, 100)}
              />
            </a>
          )
        };
      case "createdOn":
        return {
          Header: stripSpecialCharacters(item),
          accessor: item,
          Cell: ({ value }) => (
            <Text key={value} fontStyle="italic">
              {formatDate(value)}
            </Text>
          )
        };
      case "filePath":
        return {
          Header: "File",
          accessor: item,
          Cell: ({ row: { values } }) => (
            <Button
              variant="outline"
              as="a"
              href={`${ENDPOINT.RAW}/${values.filePath}`}
              target="_blank"
              download={!adminOrAuthor(values.user.id)}
              leftIcon={<DownloadIcon />}
              colorScheme="blue"
            >
              {downloadLabel}
            </Button>
          )
        };

      default:
        return {
          Header: stripSpecialCharacters(item),
          accessor: item,
          Cell: ({ value }) => (
            <Text key={value} fontStyle="italic">
              {value}
            </Text>
          )
        };
    }
  });
};
