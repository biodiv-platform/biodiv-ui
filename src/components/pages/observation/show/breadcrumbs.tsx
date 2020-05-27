import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import { useStoreState } from "easy-peasy";
import React from "react";

const Breadcrumbs = ({ crumbs }) => {
  const { webAddress } = useStoreState((s) => s.currentGroup);

  return crumbs ? (
    <Box p={2} px={4} mb={4} className="white-box fadeInUp delay-2">
      <Breadcrumb spacing="8px" separator={<Icon name="chevron-right" />}>
        {crumbs.map(({ name, id }) => (
          <BreadcrumbItem key={id}>
            <LocalLink href={`${webAddress}/observation/list`} params={{ taxon: id }}>
              <BreadcrumbLink>{name}</BreadcrumbLink>
            </LocalLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  ) : null;
};

export default Breadcrumbs;
