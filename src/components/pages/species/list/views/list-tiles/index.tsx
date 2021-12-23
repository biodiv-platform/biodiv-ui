import SpeciesLoading from "@components/pages/common/loading";
import styled from "@emotion/styled";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useSpeciesList from "../../use-species-list";
import GridViewCard from "./card";

const GridViewBox = styled.div`
  .grid-card {
    margin-top: 2px;
    display: grid;
    grid-gap: 1.25rem;
    margin-bottom: 1rem;

    @media (min-width: 1441px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1440px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default function SpeciesList() {
  const { speciesData, nextPage } = useSpeciesList();

  return (
    <GridViewBox className="view_list_minimal">
      <InfiniteScroll
        dataLength={speciesData.l.length}
        next={nextPage}
        hasMore={speciesData.l.length > 0 && speciesData.hasMore}
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
