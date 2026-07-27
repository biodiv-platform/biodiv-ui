import { TaxonNameCell, TaxonRankCell } from "./taxon-rank-cell";

const doFilter = (taxonTiles) => {
  const { name, id, rank, status, position } = taxonTiles[0];
  return Object.keys({ name, id, rank, status, position });
};

export const taxonTableMetaData = (taxonTiles) => {
  const header = taxonTiles.length > 0 ? doFilter(taxonTiles) : [];

  return header.map((item) => {
    switch (item) {
      case "name":
        return {
          Header: "taxon:modal.attributes.name.title",
          accessor: "name",
          style: { paddingTop: 0, paddingBottom: 0 },
          Cell: TaxonNameCell
        };

      case "id":
        return {
          Header: "taxon:modal.attributes.id.title",
          accessor: "id"
        };

      case "rank":
        return {
          Header: "taxon:rank.title",
          accessor: "rank",
          Cell: TaxonRankCell
        };

      case "status":
        return {
          Header: "taxon:status.title",
          accessor: "status"
        };

      case "position":
        return {
          Header: "taxon:position.title",
          accessor: "position"
        };

      default:
        return {
          Header: item.replace(/(\B[A-Z])/g, " $1").replace(/^./, item[0].toUpperCase()),
          accessor: item
        };
    }
  });
};
