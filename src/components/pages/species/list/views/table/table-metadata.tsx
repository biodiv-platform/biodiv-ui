import { Image } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import ScientificName from "@components/@core/scientific-name";
import SpeciesGroupBox from "@components/pages/observation/show/info/species-group";
import { RESOURCE_SIZE } from "@static/constants";
import { OBSERVATION_FALLBACK } from "@static/inline-images";
import { getResourceThumbnail } from "@utils/media";
import { stripTags } from "@utils/text";
import React from "react";

const doFilter = (speciesTiles) => {
  const { name, reprImage, sGroup, commonName } = speciesTiles[0];
  return Object.keys({ reprImage, name, sGroup, commonName });
};

export const speciesTableMetaData = (speciesTiles, speciesGroups) => {
  const header = speciesTiles.length > 0 ? doFilter(speciesTiles) : [];

  return header.map((item) => {
    switch (item) {

      case "name":
        return {
          Header: "species:scientific_name",
          accessor: "name",
          Cell: ({ value, cell }) => (
            <BlueLink href={`/species/show/${cell.row.original.id}`}>
              <ScientificName value={value} />
            </BlueLink>
          )
        };

      case "reprImage":
        return {
          Header: "species:resource",
          accessor: "reprImage",
          Cell: ({ value, cell }) => (
            <Image
              borderRadius={4}
              title={stripTags(cell.row.original.name)}
              boxSize="3rem"
              src={getResourceThumbnail(
                cell.row.original.context,
                value,
                RESOURCE_SIZE.LIST_THUMBNAIL
              )}
              fallbackSrc={OBSERVATION_FALLBACK.PHOTO}
            />
          )
        };

      case "sGroup":
        return {
          Header: "species:species_group",
          accessor: "sGroup",
          Cell: ({ value }) => (
            <SpeciesGroupBox
              id={parseInt(value)}
              canEdit={false}
              speciesGroups={speciesGroups}
              observationId={value}
            />
          )
        };
        
      default:
        return {
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
          accessor: item
        };
    }
  });
};
