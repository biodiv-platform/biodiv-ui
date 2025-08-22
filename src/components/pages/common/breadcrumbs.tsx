import { Box, Breadcrumb } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";

const TaxonBreadcrumbs = ({ crumbs, type }) =>
  crumbs ? (
    <Box p={2} px={4} mb={4} className="white-box fadeInUp delay-2" overflowX="auto">
      <Breadcrumb.Root gap="8px">
        <Breadcrumb.List>
          {crumbs.map(({ name, id }) => (
            <>
              <Breadcrumb.Item key={id}>
                <Breadcrumb.Link whiteSpace="nowrap" asChild>
                  <LocalLink href={`/${type}/list`} params={{ taxon: id }}>
                    {name}
                  </LocalLink>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
            </>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Box>
  ) : null;

export default TaxonBreadcrumbs;
