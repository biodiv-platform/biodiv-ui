import { Link } from "@chakra-ui/core";
import ObservationLoading from "@components/pages/common/loading";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useLandscapeFilter from "../use-landscape-filter";
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
      grid-template-columns: repeat(5, 1fr);
    }

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default function LandscapeList({ nextOffset }) {
  const { landscapeData, nextPage } = useLandscapeFilter();
  const { t } = useTranslation();

  return Array.isArray(landscapeData.l) ? (
    <GridViewBox className="view_list_minimal">
      <InfiniteScroll
        dataLength={landscapeData.l.length}
        next={nextPage}
        hasMore={landscapeData.hasMore}
        loader={<ObservationLoading key={0} />}
        scrollableTarget="items-container"
      >
        <div className="grid-card">
          {landscapeData.l.map((o) => (
            <GridViewCard o={o} />
          ))}
        </div>
      </InfiniteScroll>
      {landscapeData.l.length > 0 && landscapeData.hasMore && (
        <Link py={4} href={`./list?offset=${nextOffset}`}>
          {t("NEXT")}
        </Link>
      )}
    </GridViewBox>
  ) : (
    <ObservationLoading />
  );
}
