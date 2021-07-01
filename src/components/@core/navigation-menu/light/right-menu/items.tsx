import SITE_CONFIG from "@configs/site-config";

import PagesMenuItem from "./pages-menu-item";

export default [
  {
    active: SITE_CONFIG.SPECIES.ACTIVE,
    name: "header:menu_secondary.species.",
    rows: [
      {
        name: "species_pages",
        to: "/species/list"
      },
      {
        name: "taxon_namelist",
        to: "/namelist/index"
      },
      {
        name: "species_traits",
        to: "/species/traits"
      },
      {
        name: "species_datatables",
        params: {
          type: "species"
        },
        to: "/dataTable/list"
      }
    ]
  },
  {
    active: SITE_CONFIG.OBSERVATION.ACTIVE,
    name: "header:menu_secondary.observation.",
    rows: [
      {
        name: "observations",
        to: "/observation/list"
      },
      {
        name: "checklists",
        to: "/checklist/index"
      },
      {
        name: "datasets",
        to: "/datasource/list"
      },
      {
        name: "observation_traits",
        to: "/observation/traits"
      },
      {
        name: "observation_datatables",
        params: {
          type: "observations"
        },
        to: "/dataTable/list"
      }
    ]
  },
  {
    active: SITE_CONFIG.MAP.ACTIVE,
    name: "header:menu_secondary.maps.",
    to: "/map"
  },
  {
    active: SITE_CONFIG.DOCUMENT.ACTIVE,
    name: "header:menu_secondary.documents.",
    rows: [
      {
        name: "documents",
        to: "/document/list"
      },
      {
        name: "document_datatables",
        params: {
          type: "documents"
        },
        to: "/dataTable/list"
      }
    ]
  },
  {
    active: SITE_CONFIG.LANDSCAPE.ACTIVE,
    name: "header:menu_secondary.landscapes.",
    to: "/landscape/list"
  },
  {
    active: SITE_CONFIG.PAGES.ACTIVE,
    cell: PagesMenuItem,
    isLazy: true,
    name: "header:menu_secondary.pages."
  },
  {
    name: "header:menu_secondary.more.",
    rows: [
      {
        active: SITE_CONFIG.ACTIVITY.ACTIVE,
        name: "activity",
        to: "/activityFeed/list"
      },
      {
        active: SITE_CONFIG.DISCUSSION.ACTIVE,
        name: "discussions",
        to: "/discussion/list"
      },
      {
        active: SITE_CONFIG.DATASET.ACTIVE,
        name: "datasets",
        to: "/dataset/list"
      },
      {
        active: SITE_CONFIG.PARTICIPANTS.ACTIVE,
        name: "participants",
        to: "/user/list"
      },
      {
        active: SITE_CONFIG.LEADERBOARD.ACTIVE,
        name: "leaderboard",
        to: "/user/leaderboard"
      },
      {
        active: SITE_CONFIG.DASHBOARD.ACTIVE,
        name: "dashboard",
        to: "/chart/show"
      },
      {
        active: SITE_CONFIG.ABOUT.ACTIVE,
        name: "about_us",
        to: "/about"
      }
    ]
  }
];
