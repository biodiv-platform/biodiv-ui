import { useLocalRouter } from "@components/@core/local-link";
import { TOKEN } from "@static/constants";
import { removeCache } from "@utils/auth";
import useNookies from "next-nookies-persist";
import { destroyCookie } from "nookies";
import React, { useEffect } from "react";

const SignOutPage = () => {
  const router = useLocalRouter();
  const { removeNookie, options } = useNookies();

  const destroyAndRedirect = async () => {
    removeNookie(TOKEN.AUTH);
    removeNookie(TOKEN.USER);
    destroyCookie({}, TOKEN.BATOKEN, options);
    destroyCookie({}, TOKEN.BRTOKEN, options);
    try {
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

SignOutPage.config = {
  header: false,
  footer: false
};

export default SignOutPage;
