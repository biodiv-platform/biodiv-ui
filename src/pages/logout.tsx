import { useLocalRouter } from "@components/@core/local-link";
import { TOKEN } from "@static/constants";
import { removeCache } from "@utils/auth";
import { removeNookie } from "next-nookies-persist";
import React, { useEffect } from "react";

const SignOutPage = () => {
  const router = useLocalRouter();

  const destroyAndRedirect = async () => {
    removeNookie(TOKEN.AUTH);
    removeNookie(TOKEN.USER);
    removeNookie(TOKEN.BATOKEN);
    removeNookie(TOKEN.BRTOKEN);
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

SignOutPage.getInitialProps = ({ ctx }) => {
  removeNookie(TOKEN.AUTH, ctx);
  removeNookie(TOKEN.USER, ctx);
  removeNookie(TOKEN.BATOKEN, ctx);
  removeNookie(TOKEN.BRTOKEN, ctx);
};

export default SignOutPage;
