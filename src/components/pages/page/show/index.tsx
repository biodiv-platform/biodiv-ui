import { Box, SimpleGrid } from "@chakra-ui/core";
import HTMLContainer from "@components/@core/html-container";
import { Page } from "@interfaces/pages";
import React from "react";

import PageHeader from "./header";
import PagesSidebar from "./sidebar";

interface PageShowPageComponentProps {
  page: Page;
}

export default function PageShowPageComponent({ page }: PageShowPageComponentProps) {
  return (
    <div className="container mt">
      <PageHeader title={page.title} pageId={page.id} />
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <PagesSidebar />
        <Box
          as={HTMLContainer}
          gridColumn={{ md: "2/5" }}
          className="fadeInUp delay-4"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </SimpleGrid>
    </div>
  );
}
