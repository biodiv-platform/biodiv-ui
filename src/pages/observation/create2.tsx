import { authorizedPageSSR } from "@components/auth/auth-redirect";
import ObservationCreate2Component from "@components/pages/observation/create2";
import { Role } from "@interfaces/custom";
import { axGetCreateObservationPageData, axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import { axGroupList } from "@services/usergroup.service";
import { axGetLangList } from "@services/utility.service";
import { DB_CONFIG } from "@static/observation-create";
import { absoluteUrl } from "@utils/basic";
import React from "react";
import IndexedDBProvider from "use-indexeddb";

const ObservationCreate2Page = (props) => (
  <IndexedDBProvider config={DB_CONFIG} loading="Loading...">
    <ObservationCreate2Component {...props} />
  </IndexedDBProvider>
);

export async function getServerSideProps(ctx) {
  authorizedPageSSR([Role.Any], ctx, true);

  const aReq = absoluteUrl(ctx);

  const [speciesGroups, languageList, groupData, licensesList] = await Promise.all([
    axGetspeciesGroups(),
    axGetLangList(),
    axGroupList(aReq.href),
    axGetLicenseList()
  ]);

  const observationCreateFormData = await axGetCreateObservationPageData(
    groupData?.currentGroup?.id,
    ctx
  );

  return {
    props: {
      observationCreateFormData: observationCreateFormData.data,
      speciesGroups: speciesGroups.data,
      languages: languageList?.data.map((l) => ({ label: l.name, value: l.id })),
      licensesList: licensesList.data
    } // will be passed to the page component as props
  };
}

export default ObservationCreate2Page;
