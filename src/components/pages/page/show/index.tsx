import { GridItem, SimpleGrid } from "@chakra-ui/react";
import Activity from "@components/pages/observation/show/activity";
import { axAddPageComment } from "@services/pages.service";
import { RESOURCE_TYPE } from "@static/constants";
import React from "react";

import PagesSidebar from "../common/sidebar";
import { UsePagesProvider } from "../common/sidebar/use-pages-sidebar";
import { Content } from "./content.server";
import { PageHeader } from "./header";

interface PageShowPageComponentProps {
  page;
}

export default function PageShowPageComponent({ page }: PageShowPageComponentProps) {
  return (
    <UsePagesProvider currentPage={page} linkType="show">
      <PageHeader page={page} />

      <div className="container">
        <SimpleGrid columns={{ md: 7 }} spacing={{ base: 0, md: 8 }}>
          <GridItem colSpan={{ md: 5 }}>
            <Content html={page.content} />
            <Activity
              resourceId={page?.id}
              resourceType={RESOURCE_TYPE.PAGE}
              commentFunc={axAddPageComment}
            />
          </GridItem>
          <GridItem colSpan={{ md: 2 }} pt={6}>
            <PagesSidebar />
          </GridItem>
        </SimpleGrid>
      </div>
    </UsePagesProvider>
  );
}
