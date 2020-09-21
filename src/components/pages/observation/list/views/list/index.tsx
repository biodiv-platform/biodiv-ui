import { Link } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import ObservationLoading from "../../loading";
import Container from "./container";

export default function ListView({ no }) {
  const { observationData, nextPage } = useObservationFilter();
  const { t } = useTranslation();

  return Array.isArray(observationData.l) ? (
    <>
      <InfiniteScroll
        dataLength={observationData.l.length}
        next={nextPage}
        hasMore={observationData.hasMore}
        loader={<ObservationLoading key={0} />}
        scrollableTarget="items-container"
      >
        {observationData.l.map((o) => (
          <Container key={o.observationId} o={o} />
        ))}
      </InfiniteScroll>
      {observationData.l.length > 0 && observationData.hasMore && (
        <Link py={4} href={`./list?offset=${no}`}>
          {t("NEXT")}
        </Link>
      )}
    </>
  ) : (
    <ObservationLoading />
  );
}
