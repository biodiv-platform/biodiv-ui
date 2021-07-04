import {
  DataTableObservationListProvider,
  DEFAULT_PARAMS
} from "@components/pages/datatable/common/use-datatableObservation-filter";
import DataTableShowPageComponent from "@components/pages/datatable/show";
import { axGetObservationByDatatableId, axGetspeciesGroups } from "@services/observation.service";
import { LIST_PAGINATION_LIMIT } from "@static/documnet-list";
import React from "react";

import Error from "../../_error";

const DatatableShowPage = ({ datatableShow, speciesGroups, observationData, filter, success }) =>
  success ? (
    <DataTableObservationListProvider observationData={observationData} filter={filter}>
      <DataTableShowPageComponent datatableShow={datatableShow} speciesGroups={speciesGroups} />
    </DataTableObservationListProvider>
  ) : (
    <Error statusCode={404} />
  );

export const getServerSideProps = async (ctx) => {
  const nextOffset = (Number(ctx.query.offset) || LIST_PAGINATION_LIMIT) + LIST_PAGINATION_LIMIT;

  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: datatableShow, success } = await axGetObservationByDatatableId(
    ctx.query.datatableId,
    {}
  );
  return {
    props: {
      observationData: {
        l: datatableShow?.observationList ? datatableShow.observationList : [],
        n: datatableShow.observationList?.length,
        datatableId: ctx.query.datatableId,
        hasMore: false
      },
      filter: DEFAULT_PARAMS,
      datatableShow,
      speciesGroups,
      nextOffset,
      success
    }
  };
};

export default DatatableShowPage;
