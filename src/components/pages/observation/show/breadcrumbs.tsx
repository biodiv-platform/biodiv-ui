import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/core";
import { ChevronRightIcon } from "@chakra-ui/icons";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import React from "react";

const Breadcrumbs = ({ crumbs }) => {
  const { currentGroup } = useGlobalState();

  return crumbs ? (
    <Box p={2} px={4} mb={4} className="white-box fadeInUp delay-2">
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
        {crumbs.map(({ name, id }) => (
          <BreadcrumbItem key={id}>
            <LocalLink href={`${currentGroup?.webAddress}/observation/list`} params={{ taxon: id }}>
              <BreadcrumbLink>{name}</BreadcrumbLink>
            </LocalLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  ) : null;
};

export default Breadcrumbs;
