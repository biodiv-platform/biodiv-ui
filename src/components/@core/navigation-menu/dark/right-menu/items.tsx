import SITE_CONFIG from "@configs/site-config.json";
import AddIcon from "@icons/add";
import { Role } from "@interfaces/custom";

import GroupListItem from "./group-list-item";

export default [
  {
    active: SITE_CONFIG.USERGROUP.ACTIVE,
    cell: GroupListItem,
    name: "HEADER.MENU_PRIMARY.GROUPS."
  },
  {
    name: "HEADER.MENU_PRIMARY.CONTRIBUTE.",
    nameIcon: AddIcon,
    isLazy: true,
    rows: [
      {
        active: SITE_CONFIG.OBSERVATION.ACTIVE,
        name: "ADD_OBSERVATION",
        to: "/observation/create",
        memberOnly: true
      },
      {
        active: SITE_CONFIG.SPECIES.ACTIVE,
        name: "CONTRIBUTE_TO_SPECIES",
        to: "/species/contribute",
        memberOnly: true
      },
      {
        active: SITE_CONFIG.MAP.ACTIVE,
        name: "CONTRIBUTE_TO_MAP",
        to: "/map/create",
        role: [Role.Admin]
      },
      /*
    {
      name: "ADD_LIST",
      to: "/dataTable/create"
    }
    */
      {
        active: SITE_CONFIG.DOCUMENT.ACTIVE,
        name: "ADD_DOCUMENT",
        to: "/document/create"
        /*
      {
        name: "ADD_DATASET",
        to: "/dataset/create"
      },
      {
        name: "ADD_TRAIT_OR_VALUE",
        to: "/trait/create"
      },
      {
        name: "ADD_FACT",
        to: "/fact/upload"
      },
      {
        name: "ADD_DATA_PACKAGE",
        to: "/dataPackage/create"
      }*/
      }
    ]
  }
];
