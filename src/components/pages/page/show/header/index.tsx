import { Box } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { PageHeading } from "./page-heading";
import { PageOptions } from "./page-options";
import { PageSlider } from "./page-slider";

export const PageHeader = ({ page }) => {
  const router = useRouter();
  const { lang } = useTranslation();

  const ogImage = getResourceThumbnail(
    RESOURCE_CTX.PAGES,
    page.socialPreview || page.galleryData?.[0]?.fileName,
    RESOURCE_SIZE.TWITTER
  );

  return (
    <>
      <NextSeo
        openGraph={{
          type: "website",
          locale: lang,
          url: SITE_CONFIG.SITE.URL + router.asPath,
          title: page.title,
          images: ogImage ? [{ url: ogImage }] : undefined,
          description: page.description
        }}
        title={page.title}
      />
      <Box
        bg="gray.800"
        bgImage="url('/next-assets/page-cover.svg')"
        color="white"
        h="300px"
        position="relative"
      >
        {page.galleryData?.length ? (
          <PageSlider images={page.galleryData} description={page.description} pageId={page.id} />
        ) : null}
        <PageHeading description={page.description}>{page.title}</PageHeading>
      </Box>
      <PageOptions title={page.title} pageId={page.id} />
    </>
  );
};
