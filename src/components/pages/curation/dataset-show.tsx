import { Box } from "@chakra-ui/react";
import { BasicTable } from "@components/@core/table";
import { axShowDataset } from "@services/extraction.service";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../common/loading";

export default function DatasetShowPage({ data, columns }) {
  return (
    <Box className="white-box" id="scrollableDiv" maxH={350} overflow="auto" mb={4}>
      <BasicTable data={data} columns={columns} />
    </Box>
  );
}
