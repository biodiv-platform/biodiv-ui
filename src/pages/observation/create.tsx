import { useLocalRouter } from "@components/@core/local-link";
import ObservationCreatePageComponent from "@components/pages/observation/create";
import { axGetspeciesGroups, axGetCreateObservationPageData } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import { encode } from "base64-url";
import React, { useEffect } from "react";
import { axGroupList } from "@services/usergroup.service";
import { absoluteUrl } from "@utils/basic";
import useGlobalState from "@hooks/useGlobalState";

const ObservationCreatePage = ({ speciesGroups, languages, ObservationCreateFormData }) => {
  const { isLoggedIn } = useGlobalState();
  const { push, asPath } = useLocalRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      push("/login", true, { forward: encode(asPath) });
    }
  }, []);

  return isLoggedIn ? (
    <ObservationCreatePageComponent
      speciesGroups={speciesGroups}
      ObservationCreateFormData={ObservationCreateFormData}
      languages={languages}
    />
  ) : null;
};

export async function getServerSideProps(ctx) {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const aReq = absoluteUrl(ctx.req);
  const { data } = await axGetLangList();
  const {
    currentGroup: { id: userGroupId }
  } = await axGroupList(aReq.href);
  const { data: ObservationCreateFormData } = await axGetCreateObservationPageData(
    userGroupId,
    ctx
  );

  return {
    props: {
      ObservationCreateFormData,
      speciesGroups,
      languages: data.map((l) => ({ label: l.name, value: l.id }))
    } // will be passed to the page component as props
  };
}

export default ObservationCreatePage;
