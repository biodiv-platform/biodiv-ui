import useTranslation from "@hooks/use-translation";
import React from "react";

import UploadersTable from "./table-uploaders";
import useTopUploaders from "./use-top-uploaders";

const TopUploaders = ({ filter }) => {
  const uploader = useTopUploaders({ filter });

  const { t } = useTranslation();

  return (
    <UploadersTable
      data={uploader.uploadersData.data}
      title={t("LIST.TOP_UPLOADERS_LIST.HEADING")}
      loadMoreUploaders={uploader.uploadersData.loadMore}
      filter={filter}
    />
  );
};

export default TopUploaders;
