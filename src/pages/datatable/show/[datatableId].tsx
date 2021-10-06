import {
  DataTableObservationListProvider,
  DEFAULT_PARAMS
} from "@components/pages/datatable/common/use-datatableObservation-filter";
import DataTableShowPageComponent from "@components/pages/datatable/show";
import { axGetObservationByDatatableId, axGetspeciesGroups } from "@services/observation.service";
import { LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import React from "react";

const DatatableShowPage = ({ datatableShow, speciesGroups, observationData, filter }) => (
  <DataTableObservationListProvider observationData={observationData} filter={filter}>
    <DataTableShowPageComponent datatableShow={datatableShow} speciesGroups={speciesGroups} />
  </DataTableObservationListProvider>
);
export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: datatableShow, success } = await axGetObservationByDatatableId(
    ctx.query.datatableId,
    {}
  );

  return success
    ? {
        props: {
          observationData: {
            l: datatableShow?.observationList ? datatableShow.observationList : [],
            n: datatableShow?.observationList?.length || 0,
            datatableId: ctx.query.datatableId,
            hasMore: true
          },
          filter: DEFAULT_PARAMS,
          datatableShow,
          speciesGroups,
          nextOffset
        }
      }
    : {
        redirect: {
          permanent: false,
          destination: "/datatable/list"
        }
      };
};

export default DatatableShowPage;
