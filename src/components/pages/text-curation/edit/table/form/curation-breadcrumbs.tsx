import { Box } from "@chakra-ui/react";
import { Breadcrumb } from "@chakra-ui/react";
import React from "react";
import { LuChevronRight } from "react-icons/lu";

const CurationTaxonBreadcrumbs = ({ crumbs }) =>
  crumbs ? (
    <Box p={2} px={4} mb={4} className="gray-box fadeInUp delay-2">
      <Breadcrumb.Root gap="8px" overflowX="auto">
        <Breadcrumb.List>
          {crumbs.map(({ name, id }) => (
            <>
              <Breadcrumb.Item key={id}>
                <Breadcrumb.Link>{name}</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator>
                <LuChevronRight />
              </Breadcrumb.Separator>
            </>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    </Box>
  ) : null;

export default CurationTaxonBreadcrumbs;
