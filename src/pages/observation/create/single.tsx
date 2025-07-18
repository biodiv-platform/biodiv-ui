import { authorizedPageSSP } from "@components/auth/auth-redirect";
import ObservationCreateSinglePageComponent from "@components/pages/observation/create";
import SITE_CONFIG from "@configs/site-config";
import { Role } from "@interfaces/custom";
import { axGroupList } from "@services/app.service";
import { axGetCreateObservationPageData, axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import { axGetLangList } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import { getLanguageId } from "@utils/i18n";
import React from "react";

const ObservationCreateSinglePage = (props) => <ObservationCreateSinglePageComponent {...props} />;

export async function getServerSideProps(ctx) {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  if (redirect) return redirect;

  const { data: speciesGroups } = await axGetspeciesGroups();
  const aReq = absoluteUrl(ctx);
  const { data } = await axGetLangList();
  const {
    currentGroup: { groupId: userGroupId }
  } = await axGroupList(aReq.href, getLanguageId(ctx.locale)?.ID ?? SITE_CONFIG.LANG.DEFAULT_ID);
  const { data: ObservationCreateFormData } = await axGetCreateObservationPageData(
    userGroupId,
    ctx
  );

  const { data: licensesList } = await axGetLicenseList();

  return {
    props: {
      ObservationCreateFormData,
      speciesGroups,
      languages: data.map((l) => ({ label: l.name, value: l.id })),
      licensesList
    }
  };
}

export default ObservationCreateSinglePage;
