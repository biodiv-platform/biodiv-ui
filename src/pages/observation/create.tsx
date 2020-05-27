import { useLocalRouter } from "@components/@core/local-link";
import ObservationCreatePageComponent from "@components/pages/observation/create";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetLangList } from "@services/utility.service";
import { TOKEN } from "@static/constants";
import { encode } from "base64-url";
import { getNookie } from "next-nookies-persist";
import React, { useEffect, useState } from "react";

const ObservationCreatePage = ({ speciesGroups, languages }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { push, asPath } = useLocalRouter();

  const init = async () => {
    const user = getNookie(TOKEN.USER);
    if (user) {
      setIsLoggedIn(true);
    } else {
      push("/login", true, { forward: encode(asPath) });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return isLoggedIn ? (
    <ObservationCreatePageComponent speciesGroups={speciesGroups} languages={languages} />
  ) : null;
};

export async function getServerSideProps() {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data } = await axGetLangList();
  return {
    props: { speciesGroups, languages: data.map((l) => ({ label: l.name, value: l.id })) } // will be passed to the page component as props
  };
}

export default ObservationCreatePage;
