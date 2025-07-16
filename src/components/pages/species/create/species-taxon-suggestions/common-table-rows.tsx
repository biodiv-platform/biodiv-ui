import LocalLink from "@components/@core/local-link";
import React from "react";
import { LuChevronRight } from "react-icons/lu";

import { BreadcrumbLink, BreadcrumbRoot } from "@/components/ui/breadcrumb";

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
      <BreadcrumbRoot gap="8px" separator={<LuChevronRight color="gray.500" />} overflowX="auto">
        {value.map((rank) => (
          <LocalLink href={`/species/list`} params={{ taxon: rank.id }}>
            <BreadcrumbLink title={rank.rank}>{rank.name}</BreadcrumbLink>
          </LocalLink>
        ))}
      </BreadcrumbRoot>
    )
  }
];
