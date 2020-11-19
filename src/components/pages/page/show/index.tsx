import { Box, SimpleGrid } from "@chakra-ui/react";
import HTMLContainer from "@components/@core/html-container";
import { Page } from "@interfaces/pages";
import React from "react";

import PageHeader from "./header";
import PagesSidebar from "./sidebar";
import { UsePagesSidebarProvider } from "./sidebar/use-pages-sidebar";

interface PageShowPageComponentProps {
  page: Page;
}

export default function PageShowPageComponent({ page }: PageShowPageComponentProps) {
  return (
    <div className="container mt">
      <PageHeader title={page.title} pageId={page.id} />
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
        <UsePagesSidebarProvider currentPage={page}>
          <PagesSidebar />
        </UsePagesSidebarProvider>
        <Box
          as={HTMLContainer}
          gridColumn={{ md: "2/5" }}
          className="fadeInUp delay-4"
          mb={8}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </SimpleGrid>
    </div>
  );
}
