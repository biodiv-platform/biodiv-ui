import SITE_CONFIG from "@configs/site-config.json";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import * as Sentry from "@sentry/react";
import { APP_VERSION, isBrowser, RESOURCE_SIZE } from "@static/constants";
import { CACHE_WHITELIST, removeCache } from "@utils/auth";
import { subscribeToPushNotification } from "@utils/user";
import { getManifestURL } from "@utils/userGroup";
import { DefaultSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function Metadata() {
  const router = useRouter();
  const { isLoggedIn, currentGroup, user } = useGlobalState();
  const canonical = SITE_CONFIG.SITE.URL + router.asPath;
  const { locale } = useTranslation();
  const manifestURL = getManifestURL(currentGroup);

  useEffect(() => {
    if (SITE_CONFIG.TOKENS.SENTRY_DSN) {
      Sentry.init({
        dsn: SITE_CONFIG.TOKENS.SENTRY_DSN as any,
        release: `biodiv-ui@${APP_VERSION}`
      });
      if (isLoggedIn) {
        Sentry.setUser({
          id: user?.id?.toString(),
          email: user?.email,
          username: user?.name
        });
      }
    }
    if (isBrowser && SITE_CONFIG.TRACKING.ENABLED) {
      removeCache(CACHE_WHITELIST);
      if (isLoggedIn) {
        const timer = setTimeout(async () => {
          await subscribeToPushNotification();
        }, 1 * 60 * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <>
      <DefaultSeo
        title={currentGroup?.name}
        canonical={canonical}
        description={SITE_CONFIG.SITE.DESCRIPTION}
        openGraph={{
          type: "website",
          locale,
          url: canonical,
          title: currentGroup?.name,
          site_name: currentGroup?.name,
          description: SITE_CONFIG.SITE.DESCRIPTION
        }}
        twitter={{
          handle: SITE_CONFIG.FOOTER.SOCIAL.TWITTER.HANDLE,
          site: SITE_CONFIG.FOOTER.SOCIAL.TWITTER.HANDLE,
          cardType: "summary_large_image"
        }}
      />
      <Head>
        <link rel="apple-touch-icon" href={currentGroup?.icon + RESOURCE_SIZE.APPLE_TOUCH} />
        <link rel="manifest" href={manifestURL} />
      </Head>
    </>
  );
}
