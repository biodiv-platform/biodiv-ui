import NoSSR from "@components/@core/no-ssr";
import { authorizedPageSSP } from "@components/auth/auth-redirect";
import ObservationCreateNextComponent from "@components/pages/observation/create-next";
import { Role } from "@interfaces/custom";
import { axGroupList } from "@services/app.service";
import { axGetCreateObservationPageData, axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import { axGetLangList } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const ObservationCreateNextPage = (props) => (
  <NoSSR>
    <ObservationCreateNextComponent {...props} />
  </NoSSR>
);

export async function getServerSideProps(ctx) {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  if (redirect) return redirect;

  const aReq = absoluteUrl(ctx);

  const [speciesGroups, languageList, groupData, licensesList] = await Promise.all([
    axGetspeciesGroups(),
    axGetLangList(),
    axGroupList(aReq.href, getLanguageId(ctx.locale)?.ID),
    axGetLicenseList()
  ]);

  const observationCreateFormData = await axGetCreateObservationPageData(
    groupData?.currentGroup?.groupId,
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

export default ObservationCreateNextPage;
