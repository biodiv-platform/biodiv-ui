import { Link } from "@chakra-ui/react";
import Loading from "@components/pages/common/loading";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import useDataTableList from "../../common/use-datatable-filter";
import InfoView from "./info";

export default function Views({ no }) {
  const { dataTableData, nextPage } = useDataTableList();
  const { t } = useTranslation();

  return Array.isArray(dataTableData?.l) ? (
    <>
      <InfiniteScroll
        dataLength={dataTableData?.l.length || 0}
        next={nextPage}
        hasMore={dataTableData?.hasMore || true}
        loader={<Loading key={0} />}
        scrollableTarget="items-container"
      >
        {dataTableData?.l.map((dt) => (
          <InfoView key={dt.id} datatable={dt} />
        ))}
      </InfiniteScroll>
      {dataTableData?.l && dataTableData.l.length > 0 && dataTableData.hasMore && (
        <Link py={4} href={`./list?offset=${no}`}>
          {t("common:next")}
        </Link>
      )}
    </>
  ) : (
    <Loading />
  );
}
