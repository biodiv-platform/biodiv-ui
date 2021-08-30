import SpeciesLoading from "@components/pages/common/loading";
import { GridViewBox } from "@components/pages/landscape/list/landscape-list";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useSpeciesList from "../use-species-list";
import GridViewCard from "./card";

export default function SpeciesList() {
  const { speciesData, nextPage } = useSpeciesList();

  return (
    <GridViewBox className="view_list_minimal">
      <InfiniteScroll
        dataLength={speciesData.l.length}
        next={nextPage}
        hasMore={speciesData.hasMore}
        loader={<SpeciesLoading key={0} />}
        scrollableTarget="items-container"
      >
        <div className="grid-card">
          {speciesData.l.map((o) => (
            <GridViewCard key={o.id} o={o} />
          ))}
        </div>
      </InfiniteScroll>
    </GridViewBox>
  );
}
