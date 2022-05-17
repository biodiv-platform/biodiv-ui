import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React from "react";

const CurationTaxonBreadcrumbs = ({ crumbs }) =>
  crumbs ? (
    <Box p={2} px={4} mb={4} className="gray-box fadeInUp delay-2">
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
        {crumbs.map(({ name, id }) => (
          <BreadcrumbItem key={id}>
            <BreadcrumbLink>{name}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  ) : null;

export default CurationTaxonBreadcrumbs;
