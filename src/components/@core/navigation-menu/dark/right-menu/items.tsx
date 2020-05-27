import GroupListItem from "./group-list-item";

export default [
  {
    name: "HEADER.MENU_PRIMARY.GROUPS.",
    cell: GroupListItem
  },
  {
    name: "HEADER.MENU_PRIMARY.CONTRIBUTE.",
    nameIcon: "ibpadd",
    rows: [
      {
        name: "ADD_OBSERVATION",
        to: "/observation/create"
      },
      {
        name: "CONTRIBUTE_TO_SPECIES",
        to: "/species/contribute"
      },
      /*
        {
          name: "ADD_LIST",
          to: "/dataTable/create"
        }
        */
      {
        name: "ADD_DOCUMENT",
        to: "/document/create"
      }
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
    ]
  }
];
