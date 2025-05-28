import useTranslation from "next-translate/useTranslation";
import React from "react";

import UploadersTable from "./table-uploaders";

const TopUploaders = ({ filter, topUploaders, isLoading }) => {
  //const uploader = useTopUploaders({ filter });

  const { t } = useTranslation();

  return (
    <UploadersTable
      data={{ isLoading: isLoading, list: topUploaders }}
      title={t("observation:list.top_uploaders_list.heading")}
      loadMoreUploaders={() => console.log("hi")}
      filter={filter}
    />
  );
};

export default TopUploaders;
