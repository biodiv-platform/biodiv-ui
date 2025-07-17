import { Box, BreadcrumbItem } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";
import { LuChevronRight } from "react-icons/lu";

import { BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb";

const TaxonBreadcrumbs = ({ crumbs, type }) =>
  crumbs ? (
    <Box p={2} px={4} mb={4} className="white-box fadeInUp delay-2" overflowX="auto">
      <BreadcrumbRoot gap="8px" separator={<LuChevronRight />}>
        {crumbs.map(({ name, id }) => (
          <BreadcrumbItem key={id}>
            <LocalLink href={`/${type}/list`} params={{ taxon: id }}>
              <BreadcrumbLink whiteSpace="nowrap">{name}</BreadcrumbLink>
            </LocalLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbRoot>
    </Box>
  ) : null;

export default TaxonBreadcrumbs;
