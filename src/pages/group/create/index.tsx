import { useLocalRouter } from "@components/@core/local-link";
import { TOKEN } from "@static/constants";
import { encode } from "base64-url";
import { getNookie } from "next-nookies-persist";
import CreateGroupPage from "../../../components/pages/group/createGroupPage";
import { axGetLangList } from "@services/utility.service";
import { axGetspeciesGroups } from "@services/observation.service";
import { axGetAllHabitat } from "@services/utility.service";
import React, { useEffect, useState } from "react";

function createGroup({ speciesGroups, habitats }) {
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

  return isLoggedIn ? <CreateGroupPage habitats={habitats} speciesGroups={speciesGroups} /> : null;
}

export async function getServerSideProps() {
  const { data: speciesGroups } = await axGetspeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();
  const { data } = await axGetLangList();
  return {
    props: {
      speciesGroups,
      languages: data.map((l) => ({ label: l.name, value: l.id })),
      habitats: habitatList.map((item) => ({ label: item.name, value: item.id, id: item.id }))
    }
  };
}

export default createGroup;
