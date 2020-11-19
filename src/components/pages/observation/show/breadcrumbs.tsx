import { ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";

const Breadcrumbs = ({ crumbs }) =>
  crumbs ? (
    <Box p={2} px={4} mb={4} className="white-box fadeInUp delay-2">
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
        {crumbs.map(({ name, id }) => (
          <BreadcrumbItem key={id}>
            <LocalLink href="/observation/list" params={{ taxon: id }}>
              <BreadcrumbLink>{name}</BreadcrumbLink>
            </LocalLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  ) : null;

export default Breadcrumbs;
