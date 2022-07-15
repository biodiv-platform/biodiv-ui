import { Box, SimpleGrid } from "@chakra-ui/react";
import { PageShowMinimal } from "@interfaces/pages";
import React from "react";

import PagesSidebar from "../common/sidebar";
import { UsePagesSidebarProvider } from "../common/sidebar/use-pages-sidebar";
import Content from "./content.server";
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
          <Box gridColumn={{ md: "2/5" }} mb={8}>
            <Content html={page.content} />
          </Box>
        </SimpleGrid>
      </div>
    </UsePagesSidebarProvider>
  );
}
