import styled from "@emotion/styled";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import ObservationLoading from "@components/pages/common/loading";
import GridViewCard from "./card";

const GridViewBox = styled.div`
  .grid-card {
    margin-top: 2px;
    display: grid;
    grid-gap: 1.25rem;
    margin-bottom: 1rem;

    @media (min-width: 1441px) {
      grid-template-columns: repeat(5, 1fr);
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

export default function GridView() {
  const { observationData, nextPage } = useObservationFilter();

  return Array.isArray(observationData.ml) ? (
    <GridViewBox className="view_list_minimal">
      <InfiniteScroll
        dataLength={observationData.ml.length}
        next={nextPage}
        hasMore={observationData.hasMore}
        loader={<ObservationLoading key={0} />}
        scrollableTarget="items-container"
      >
        <div className="grid-card">
          {observationData.ml.map((o) => (
            <GridViewCard o={o} />
          ))}
        </div>
      </InfiniteScroll>
    </GridViewBox>
  ) : (
    <ObservationLoading />
  );
}
