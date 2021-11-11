import { Link } from "@chakra-ui/react";
import LoadingSpinner from "@components/pages/common/loading";
import useDocumentFilter from "@components/pages/document/common/use-document-filter";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Container from "./container";

export default function ListView({ no }) {
  const { documentData, nextPage } = useDocumentFilter();
  const { t } = useTranslation();

  return Array.isArray(documentData.l) ? (
    <>
      <InfiniteScroll
        dataLength={documentData.l.length}
        next={nextPage}
        hasMore={documentData.l.length > 0 && documentData.hasMore}
        loader={<LoadingSpinner key={0} />}
        scrollableTarget="items-container"
      >
        {documentData.l.map((item) => (
          <Container key={item.document.id} o={item} />
        ))}
      </InfiniteScroll>
      {documentData.l.length > 0 && documentData.hasMore && (
        <Link py={4} href={`./list?offset=${no}`}>
          {t("common:next")}
        </Link>
      )}
    </>
  ) : (
    <LoadingSpinner />
  );
}
