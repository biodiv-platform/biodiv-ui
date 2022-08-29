import { Box, SimpleGrid } from "@chakra-ui/react";
import { PageUpdate } from "@interfaces/pages";
import React from "react";

import PagesSidebar from "../common/sidebar";
import { UsePagesProvider } from "../common/sidebar/use-pages-sidebar";
import PageEditForm from "./form";

interface PageEditPageComponentProps {
  page: PageUpdate;
}

export default function PageEditPageComponent({ page }: PageEditPageComponentProps) {
  return (
    <div className="container mt">
      <UsePagesProvider currentPage={page} linkType="edit">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 0, md: 4 }}>
          <PagesSidebar />
          <Box gridColumn={{ md: "2/5" }}>
            <PageEditForm page={page} key={page.id} />
          </Box>
        </SimpleGrid>
      </UsePagesProvider>
    </div>
  );
}
