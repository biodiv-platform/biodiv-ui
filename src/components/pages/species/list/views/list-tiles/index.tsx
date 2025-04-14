import { SimpleGrid } from "@chakra-ui/react";
import SpeciesLoading from "@components/pages/common/loading";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useSpeciesList from "../../use-species-list";
import GridViewCard from "./card";

export default function SpeciesList() {
  const { speciesData, nextPage, getCheckboxProps } = useSpeciesList();

  return (
    <InfiniteScroll
      dataLength={speciesData.l.length}
      next={nextPage}
      hasMore={speciesData.l.length > 0 && speciesData.hasMore}
      loader={<SpeciesLoading key={0} />}
      scrollableTarget="items-container"
    >
      <SimpleGrid columns={{ base: 1, md: 5 }} gap={4}>
        {speciesData.l.map((o) => (
          <GridViewCard getCheckboxProps={getCheckboxProps} key={o.id} o={o} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
}
