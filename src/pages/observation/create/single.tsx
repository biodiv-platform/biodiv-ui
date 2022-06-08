import { useLocalRouter } from "@components/@core/local-link";
import ObservationCreateSinglePageComponent from "@components/pages/observation/create";
import useGlobalState from "@hooks/use-global-state";
import { axGetCreateObservationPageData, axGetspeciesGroups } from "@services/observation.service";
import { axGetLicenseList } from "@services/resources.service";
import { axGroupList } from "@services/usergroup.service";
import { axGetLangList } from "@services/utility.service";
import { absoluteUrl } from "@utils/basic";
import { encode } from "base64-url";
import React, { useEffect } from "react";

const ObservationCreateSinglePage = ({
  speciesGroups,
  languages,
  ObservationCreateFormData,
  licensesList
}) => {
  const { isLoggedIn } = useGlobalState();
  const { push, asPath } = useLocalRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      push("/login", true, { forward: encode(asPath) });
    }
  }, []);

  return isLoggedIn ? (
    <ObservationCreateSinglePageComponent
      speciesGroups={speciesGroups}
      ObservationCreateFormData={ObservationCreateFormData}
      languages={languages}
      licensesList={licensesList}
    />
  ) : null;
};

export async function getServerSideProps(ctx) {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const aReq = absoluteUrl(ctx);
  const { data } = await axGetLangList();
  const {
    currentGroup: { id: userGroupId }
  } = await axGroupList(aReq.href);
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
    } // will be passed to the page component as props
  };
}

export default ObservationCreateSinglePage;
