import { authorizedPageSSP } from "@components/auth/auth-redirect";
import DataTableCreatePageComponent from "@components/pages/datatable/create";
import { Role } from "@interfaces/custom";
import {
  axGetCreateObservationPageData,
  axGetObservationListConfig,
  axGetspeciesGroups
} from "@services/observation.service";
import { axGroupList } from "@services/usergroup.service";
import { axGetLangList } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import React from "react";

const DataTableCreatePage = (props) => <DataTableCreatePageComponent {...props} />;

export async function getServerSideProps(ctx) {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  if (redirect) return redirect;

  const { data: speciesGroups } = await axGetspeciesGroups();
  const {
    data: { traits, customFields }
  } = await axGetObservationListConfig();
  const { data } = await axGetLangList();
  const observationConfig = { traits, customFields };

  const aReq = absoluteUrl(ctx);

  const {
    currentGroup: { id: userGroupId }
  } = await axGroupList(aReq.href);
  const {
    data: { customField }
  } = await axGetCreateObservationPageData(userGroupId, ctx);

  const formatCustomField = customField?.map((item) => item?.customFields);
  return {
    props: {
      speciesGroups,
      languages: data.map((l) => ({ label: l.name, value: l.id })),
      datasetId: ctx.query.dataset || null,
      observationConfig: userGroupId
        ? { ...observationConfig, customFields: formatCustomField }
        : { ...observationConfig }
    }
  };
}

export default DataTableCreatePage;
