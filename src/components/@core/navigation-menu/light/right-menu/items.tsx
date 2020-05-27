import PagesMenuItem from "./pages-menu-item";

export default [
  {
    name: "HEADER.MENU_SECONDARY.SPECIES.",
    rows: [
      {
        name: "SPECIES_PAGES",
        to: "/species/list"
      },
      {
        name: "TAXON_NAMELIST",
        to: "/namelist/index"
      },
      {
        name: "SPECIES_TRAITS",
        to: "/species/traits"
      },
      {
        name: "SPECIES_DATATABLES",
        to: "/dataTable/list",
        params: { type: "species" }
      }
    ]
  },
  {
    name: "HEADER.MENU_SECONDARY.OBSERVATION.",
    rows: [
      {
        name: "OBSERVATIONS",
        to: "/observation/list"
      },
      {
        name: "CHECKLISTS",
        to: "/checklist/index"
      },
      {
        name: "DATASETS",
        to: "/datasource/list"
      },
      {
        name: "OBSERVATION_TRAITS",
        to: "/observation/traits"
      },
      {
        name: "OBSERVATION_DATATABLES",
        to: "/dataTable/list",
        params: { type: "observations" }
      }
    ]
  },
  { name: "HEADER.MENU_SECONDARY.MAPS.", to: "/map" },
  {
    name: "HEADER.MENU_SECONDARY.DOCUMENTS.",
    rows: [
      {
        name: "DOCUMENTS",
        to: "/document/list"
      },
      {
        name: "DOCUMENT_DATATABLES",
        to: "/dataTable/list",
        params: { type: "documents" }
      }
    ]
  },
  {
    name: "HEADER.MENU_SECONDARY.PAGES.",
    cell: PagesMenuItem
  },
  {
    name: "HEADER.MENU_SECONDARY.MORE.",
    rows: [
      {
        name: "ACTIVITY",
        to: "/activityFeed/list"
      },
      {
        name: "DISCUSSIONS",
        to: "/discussion/list"
      },
      {
        name: "DATASETS",
        to: "/dataset/list"
      },
      {
        name: "PARTICIPANTS",
        to: "/user/list"
      },
      {
        name: "LEADERBOARD",
        to: "/user/leaderboard"
      },
      {
        name: "DASHBOARD",
        to: "/chart/show"
      },
      {
        name: "ABOUT_US",
        to: "/theportal"
      }
    ]
  }
];
