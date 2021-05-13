import DataTableShowPageComponent from "@components/pages/datatable/show";
import React from "react";

const DatatableShowPage = ({ datatableId }) => (
  <DataTableShowPageComponent datatableId={datatableId} />
);

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      datatableId: ctx.query.datatableId
    }
  };
};

export default DatatableShowPage;
