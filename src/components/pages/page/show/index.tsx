import { Box, GridItem, SimpleGrid } from "@chakra-ui/react";
import { PageShowMinimal } from "@interfaces/pages";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { preProcessContent } from "@utils/pages.util";
import React from "react";

import PagesSidebar from "../common/sidebar";
import { UsePagesSidebarProvider } from "../common/sidebar/use-pages-sidebar";
import PageHeader from "./header";

interface PageShowPageComponentProps {
  page: PageShowMinimal;
}

export default function PageShowPageComponent({ page }: PageShowPageComponentProps) {
  return (
    <UsePagesSidebarProvider currentPage={page} linkType="show">
      <div className="container mt">
        <PageHeader title={page.title} pageId={page.id} />
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
          <PagesSidebar />
          <Box gridColumn={{ md: "2/5" }} className="fadeInUp delay-4" mb={8}>
            <Prose>
              <div dangerouslySetInnerHTML={{ __html: preProcessContent(page.content) }} />
            </Prose>
          </Box>
        </SimpleGrid>
      </div>
    </UsePagesSidebarProvider>
  );
}
