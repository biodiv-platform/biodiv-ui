import { Button, Image, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import DownloadIcon from "@icons/download";
import { axDownloadFile } from "@services/user.service";
import { ENDPOINT, isBrowser } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { formatDate } from "@utils/date";
import { getUserImage } from "@utils/media";
import notification, { NotificationType } from "@utils/notification";
import React from "react";

const doFilter = (data) => {
  if (data[0]) {
    const { params, status, id, filterUrl, ...others } = data[0];
    return data.length ? Object.keys({ ...others }) : [];
  }
};

const downloadFile = async (value,errorMessage) => {
  const { success } = await axDownloadFile(value);
  if (isBrowser) {
    success
      ? window.open(`${ENDPOINT.RAW}/${value}`, "_blank")?.focus()
      : notification(`${errorMessage}`, NotificationType.Error);
  }
};
export const downloadLogsRow = (data, downloadLabel, errorMessage) => {
  const header = doFilter(data);

  return header?.map((item) => {
    switch (item) {
      case "sourceType":
        return {
          Header: "Source",
          accessor: "sourceType",
          Cell: ({ row }) => (
            <a href={`${data[row.index].filterUrl}`}>
              <BlueLink> {row.values.sourceType || "Unkown"} </BlueLink>
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
          Header: "File",
          accessor: item,
          Cell: ({ row: { values } }) => (
            <Button
              variant="outline"
              leftIcon={<DownloadIcon />}
              isDisabled={!adminOrAuthor(values.user.id)}
              onClick={() => downloadFile(values.filePath, errorMessage)}
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
