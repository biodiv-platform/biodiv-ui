import { Link } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import useTranslation from "@hooks/use-translation";
import { FORWARD_BLACKLIST } from "@static/constants";
import { encode } from "base64-url";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function LoginButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const [params, setParams] = useState({});

  useEffect(() => {
    setParams(
      FORWARD_BLACKLIST.find((u) => router.asPath.includes(u))
        ? {}
        : { forward: encode(router.asPath) }
    );
  }, [router.asPath]);

  return (
    <LocalLink href="/login" params={params} prefixGroup={true}>
      <Link>{t("HEADER.SIGN_IN")}</Link>
    </LocalLink>
  );
}
