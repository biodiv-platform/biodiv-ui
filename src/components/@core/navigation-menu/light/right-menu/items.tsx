import SITE_CONFIG from "@configs/site-config";

import PagesMenuItem from "./pages-menu-item";

export default [
  {
    active: SITE_CONFIG.SPECIES.ACTIVE,
    name: "header:menu_secondary.species.",
    to: "/species/list"
  },
  {
    active: SITE_CONFIG.OBSERVATION.ACTIVE,
    name: "header:menu_secondary.observation.",
    rows: [
      {
        name: "all_observations",
        to: "/observation/list"
      },
      {
        name: "datatables",
        to: "/datatable/list"
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
    to: "/document/list"
  },
  {
    active: SITE_CONFIG.LANDSCAPE.ACTIVE,
    name: "header:menu_secondary.landscapes.",
    to: "/landscape/list"
  },
  {
    name: "header:menu_secondary.more.",
    rows: [
      {
        name: "taxonomy",
        to: "/taxonomy/list"
      },
      {
        active: SITE_CONFIG.PARTICIPANTS.ACTIVE,
        name: "users",
        to: "/user/list"
      },
      {
        active: SITE_CONFIG.LEADERBOARD.ACTIVE,
        name: "leaderboard",
        to: "/user/leaderboard"
      },
      {
        active: SITE_CONFIG.ABOUT.ACTIVE,
        name: "download_logs",
        to: "/user/download-logs"
      },
      {
        active: SITE_CONFIG.ABOUT.ACTIVE,
        name: "about_us",
        to: "/about"
      }
    ]
  },
  {
    active: SITE_CONFIG.HEADER.IDAO.ACTIVE,
    name: "header:menu_secondary.idao.",
    to: SITE_CONFIG.HEADER.IDAO.LINK
  },
  {
    active: SITE_CONFIG.PAGES.ACTIVE,
    cell: PagesMenuItem,
    isLazy: true,
    name: "header:menu_secondary.pages."
  }
];
