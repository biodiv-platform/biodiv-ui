import { Button, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import { ENDPOINT } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { formatDate } from "@utils/date";
import { getUserImage } from "@utils/media";
import { stripSpecialCharacters, stripTags } from "@utils/text";
import React from "react";
import { LuDownload } from "react-icons/lu";

import { ImageWithFallback } from "@/components/@core/image-with-fallback";

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
            <BlueLink href={`${data[row.index].filterUrl}`}>
              {row.values.sourceType || unknown}
            </BlueLink>
          )
        };

      case "user":
        return {
          Header: stripSpecialCharacters(item),
          accessor: "user",
          Cell: ({ value }) => (
            <a href={`/user/show/${value.id}`}>
              <ImageWithFallback
                borderRadius={50}
                title={value.name}
                boxSize="2rem"
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
          Cell: ({ row: { values } }) => {
            const isDisabled = !adminOrAuthor(values.user.id) || values.type == "PNG";
            return (
              <Button
                variant="outline"
                size="sm"
                as={isDisabled ? "button" : "a"}
                disabled={isDisabled}
                colorPalette="blue"
                asChild
              >
                <a
                  href={
                    !isDisabled
                      ? values.filePath.startsWith("/naksha")
                        ? values.filePath
                        : `${ENDPOINT.RAW}${values.filePath}`
                      : undefined
                  }
                >
                  <LuDownload />
                  {downloadLabel}
                </a>
              </Button>
            );
          }
        };

      default:
        return {
          Header: stripSpecialCharacters(item),
          accessor: item,
          Cell: ({ value }) => (
            <Text key={value} fontStyle="italic">
              {stripTags(value)}
            </Text>
          )
        };
    }
  });
};
