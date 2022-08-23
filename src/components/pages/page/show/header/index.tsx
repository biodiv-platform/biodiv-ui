import { Box } from "@chakra-ui/react";
import { NextSeo } from "next-seo";
import React from "react";

import { PageHeading } from "./page-heading";
import { PageOptions } from "./page-options";
import { PageSlider } from "./page-slider";

export const PageHeader = ({ page }) => (
  <>
    <NextSeo openGraph={{ title: page.title, description: page.description }} title={page.title} />
    <Box bg="gray.800" color="white" h="300px" position="relative">
      <PageSlider images={page.galleryData} description={page.description} />
      <PageHeading description={page.description}>{page.title}</PageHeading>
    </Box>
    <PageOptions title={page.title} pageId={page.id} />
  </>
);
