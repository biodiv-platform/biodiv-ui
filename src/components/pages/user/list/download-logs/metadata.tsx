import { Button, Image, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import DownloadIcon from "@icons/download";
import { axDownloadFile } from "@services/user.service";
import { formatDate } from "@utils/date";
import { getUserImage } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

const doFilter = (data) => {
  const { params, filterUrl, ...others } = data[0];
  return data.length
    ? Object.keys({ ...others })
        .map((key) => [key, data.some((d) => !!d[key])]) // tries to find truthy value for each key
        .filter(([, value]) => value) // filters out empty keys
        .map(([key]) => key) // returns only keys
    : [];
};

const downloadFile = async (value, errorMessage) => {
  const { success } = await axDownloadFile(value);
  if (!success) {
    notification(`${errorMessage}`, NotificationType.Error);
  }
};
export const downloadLogsRow = (data, downloadLabel, errorMessage) => {
  const header = doFilter(data);

  return header.map((item, index) => {
    switch (item) {
      case "sourceType":
        return {
          Header: "Source",
          accessor: "sourceType",
          Cell: ({ value }) => (
            <a href={`${data[index].filterUrl}`}>
              <BlueLink> {value} </BlueLink>
            </a>
          )
        };
      case "user":
        return {
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
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
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
          accessor: item,
          Cell: ({ value }) => (
            <Text key={value} fontStyle="italic">
              {formatDate(value)}
            </Text>
          )
        };
      case "filePath":
        return {
          Header: "file",
          accessor: item,
          Cell: ({ value }) => (
            <Button
              variant="outline"
              leftIcon={<DownloadIcon />}
              onClick={() => downloadFile(value, errorMessage)}
              colorScheme="blue"
            >
              {downloadLabel}
            </Button>
          )
        };

      default:
        return {
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
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
