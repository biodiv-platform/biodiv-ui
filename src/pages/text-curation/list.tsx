import TextCurationListPage from "@components/pages/text-curation/list";
import { axGetDataSheetInfo } from "@services/curate.service";
import React from "react";

export default function CurateListPage({ data }) {
  return <TextCurationListPage data={data} />;
}

export const getServerSideProps = async () => {
  const { data } = await axGetDataSheetInfo();

  return {
    props: {
      data: data
    }
  };
};
