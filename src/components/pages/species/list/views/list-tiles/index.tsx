import { SimpleGrid } from "@chakra-ui/react";
import SpeciesLoading from "@components/pages/common/loading";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useSpeciesList from "../../use-species-list";
import GridViewCard from "./card";

export default function SpeciesList() {
  const { speciesData, nextPage } = useSpeciesList();

  return (

    <InfiniteScroll
      dataLength={speciesData.l.length}
      next={nextPage}
      hasMore={speciesData.l.length > 0 && speciesData.hasMore}
      loader={<SpeciesLoading key={0} />}
      scrollableTarget="items-container"
    >
      <SimpleGrid columns={[1, 1, 4, 4]} spacing={10}>
        {speciesData.l.map((o) => (
          <GridViewCard key={o.id} o={o} />
        ))}
      </SimpleGrid>

    </InfiniteScroll>

  );
}
