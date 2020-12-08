import { Link } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import ObservationLoading from "../../loading";
import Container from "./container";

export default function ListView({ no }) {
  const { observationData, nextPage } = useObservationFilter();
  const { t } = useTranslation();

  return Array.isArray(observationData?.l) ? (
    <>
      <InfiniteScroll
        dataLength={observationData?.l.length || 0}
        next={nextPage}
        hasMore={observationData?.hasMore || false}
        loader={<ObservationLoading key={0} />}
        scrollableTarget="items-container"
      >
        {observationData?.l.map((o) => (
          <Container key={o.observationId} o={o} />
        ))}
      </InfiniteScroll>
      {observationData?.l && observationData.l.length > 0 && observationData.hasMore && (
        <Link py={4} href={`./list?offset=${no}`}>
          {t("NEXT")}
        </Link>
      )}
    </>
  ) : (
    <ObservationLoading />
  );
}
