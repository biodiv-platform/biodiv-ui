import { BasicTable } from "@components/@core/table";
import DatasetShowPage from "@components/pages/curation/dataset-show";
import { axShowDataset } from "@services/extraction.service";
import React from "react";
import TextEditor from "react-data-grid";
import { json } from "stream/consumers";
/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

export default function DatasetShow({ data, columns }) {
  return <DatasetShowPage data={data} columns={columns} />;
}

export const getServerSideProps = async (ctx) => {
  const datasetId = ctx.query.datatableId;
  const { data } = await axShowDataset(datasetId);

  const columnNames = Object.keys(data[0]);

  // const columns = columnNames.map((v) => ({
  //   key: v,
  //   name: v
  // }));

  // console.log(data);
  return {
    props: {
      data: data,
      columns: columnNames
    }
  };
};
