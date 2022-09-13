import { authorizedPageSSP } from "@components/auth/auth-redirect";
import ObservationCreateNextComponent from "@components/pages/observation/create-next";
import { Role } from "@interfaces/custom";
import { axGroupList } from "@services/app.service";
import { axGetCreateObservationPageData, axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import { axGetLangList } from "@services/utility.service";
import { DB_CONFIG } from "@static/observation-create";
import { absoluteUrl } from "@utils/basic";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import IndexedDBProvider from "use-indexeddb";

const ObservationCreateNextPage = (props) => {
  const { t } = useTranslation();

  return (
    <IndexedDBProvider
      config={DB_CONFIG}
      loading={t("common:loading")}
      fallback={t("observation:idb_not_supported")}
    >
      <ObservationCreateNextComponent {...props} />
    </IndexedDBProvider>
  );
};

export async function getServerSideProps(ctx) {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  if (redirect) return redirect;

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

export default ObservationCreateNextPage;
