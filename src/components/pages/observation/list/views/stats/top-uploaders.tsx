import useTranslation from "next-translate/useTranslation";
import React from "react";

import UploadersTable from "./table-uploaders";
import useTopUploaders from "./use-top-uploaders";

const TopUploaders = ({ filter, topUploaders, isLoading }) => {
  const uploader = useTopUploaders({ filter });

  const { t } = useTranslation();

  return (
    <UploadersTable
      data={{ isLoading: isLoading || uploader.uploadersData.data.isLoading, list: [...topUploaders,...uploader.uploadersData.data.list] }}
      title={t("observation:list.top_uploaders_list.heading")}
      loadMoreUploaders={uploader.uploadersData.loadMore}
      filter={filter}
    />
  );
};

export default TopUploaders;
