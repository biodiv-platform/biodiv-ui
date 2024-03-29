import { useLocalRouter } from "@components/@core/local-link";
import { removeCache, removeCookies } from "@utils/auth";
import React, { useEffect } from "react";

const logout = () => {
  const router = useLocalRouter();

  const destroyAndRedirect = async () => {
    try {
      removeCookies();
      await removeCache();
    } catch (e) {
      console.error(e);
    }
    router.push("/", true, {}, true);
  };

  useEffect(() => {
    destroyAndRedirect();
  }, []);

  return <pre>Please Wait...</pre>;
};

logout.config = {
  header: false,
  footer: false
};

export default logout;
