import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/breadcrumb";
import { ChevronRightIcon } from "@chakra-ui/icons";
import LocalLink from "@components/@core/local-link";
import React from "react";

export const SpeciesCreateCommonTableRows = [
  {
    Header: "ID",
    accessor: "taxonomyDefinition.id"
  },
  {
    Header: "Name",
    accessor: "taxonomyDefinition.name"
  },
  {
    Header: "Rank",
    accessor: "taxonomyDefinition.rank"
  },
  {
    Header: "Position",
    accessor: "taxonomyDefinition.position"
  },
  {
    Header: "Status",
    accessor: "taxonomyDefinition.status"
  },
  {
    Header: "Registry",
    accessor: "registry",
    Cell: ({ value }) => (
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} overflowX="auto">
        {value.map((rank) => (
          <BreadcrumbItem key={rank.id}>
            <LocalLink href={`/species/list`} params={{ taxon: rank.id }}>
              <BreadcrumbLink title={rank.rank}>{rank.name}</BreadcrumbLink>
            </LocalLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    )
  }
];
