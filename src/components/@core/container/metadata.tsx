import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { isBrowser, RESOURCE_SIZE } from "@static/constants";
import { CACHE_WHITELIST, removeCache } from "@utils/auth";
import { subscribeToPushNotification } from "@utils/user";
import { getManifestURL } from "@utils/userGroup";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo } from "react";

export default function Metadata() {
  const router = useRouter();
  const { isLoggedIn, currentGroup } = useGlobalState();
  const canonical = SITE_CONFIG.SITE.URL + router.asPath;
  const { lang } = useTranslation();
  const manifestURL = useMemo(() => getManifestURL(currentGroup), [currentGroup]);

  useEffect(() => {
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
          locale: lang,
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
      {SITE_CONFIG.TRACKING.ENABLED && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.TRACKING.GA_ID}`}
          />
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'SITE_CONFIG.TRACKING.GA_ID');
        `
            }}
          />
        </>
      )}
    </>
  );
}
