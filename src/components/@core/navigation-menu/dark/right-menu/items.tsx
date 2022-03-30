import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import { Role } from "@interfaces/custom";

import GroupListItem from "./group-list-item";

export default [
  {
    active: SITE_CONFIG.USERGROUP.ACTIVE,
    cell: GroupListItem,
    isLazy: true,
    name: "header:menu_primary.groups."
  },
  {
    name: "header:menu_primary.contribute.",
    nameIcon: AddIcon,
    isLazy: true,
    rows: [
      {
        active: SITE_CONFIG.OBSERVATION.ACTIVE,
        name: "add_observation",
        to: "/observation/create",
        memberOnly: true
      },
      {
        active: SITE_CONFIG.DATATABLE.ACTIVE,
        name: "add_datatable",
        to: "/datatable/create",
        memberOnly: true
      },
      {
        active: SITE_CONFIG.SPECIES.ACTIVE,
        name: "contribute_to_species",
        to: "/species/contribute",
        memberOnly: true
      },
      {
        active: SITE_CONFIG.MAP.ACTIVE,
        name: "contribute_to_map",
        to: "/map/create",
        role: [Role.Admin]
      },
      {
        active: SITE_CONFIG.DATA_CURATION.ACTIVE,
        name: "data_curate",
        to: "/curation"
      },
      /*
    {
      name: "add_list",
      to: "/dataTable/create"
    }
    */
      {
        active: SITE_CONFIG.DOCUMENT.ACTIVE,
        name: "add_document",
        to: "/document/create"
        /*
      {
        name: "add_dataset",
        to: "/dataset/create"
      },
      {
        name: "add_trait_or_value",
        to: "/trait/create"
      },
      {
        name: "add_fact",
        to: "/fact/upload"
      },
      {
        name: "add_data_package",
        to: "/dataPackage/create"
      }*/
      }
    ]
  }
];
