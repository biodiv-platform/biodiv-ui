import SITE_CONFIG from "@configs/site-config";

export const CARD_META = {
  species: {
    icon: "species",
    link: "/species/list",
    color: "#F64754"
  },
  observation: {
    icon: "observation",
    link: "/observation/list",
    color: "#4299E1"
  },
  maps: {
    icon: "maps",
    link: "/map",
    color: "#F6C04B"
  },
  documents: {
    icon: "documents",
    link: "/document/list",
    color: "#AB73E1"
  },
  activeUser: {
    icon: "user-groups",
    link: "/user/list",
    color: "#38B2AC"
  },
  discussions: {
    icon: "discussions",
    link: "/discussion/list",
    color: "#82C68F"
  }
};

export const FEATURES = [
  {
    icon: "species",
    title: "species_information",
    link: "/species/list",
    tag: ["ibp"]
  },
  {
    icon: "species",
    title: "mikoko_species_information",
    link: "/species/list",
    tag: ["mikoko"]
  },
  {
    icon: "observation",
    title: "citizen_science",
    link: "/observation/list",
    tag: ["ibp"]
  },
  {
    icon: "maps",
    title: "maps",
    link: "/map",
    tag: ["ibp", "mikoko"]
  },
  {
    icon: "search",
    title: "mikoko_idao",
    link: SITE_CONFIG.HEADER.IDAO.LINK,
    tag: ["mikoko"]
  },
  {
    icon: "open-data",
    title: "datasets",
    link: "/data-table/list",
    tag: ["mikoko"]
  },
  {
    icon: "user-groups",
    title: "mikoko_monitoring",
    link: "/user/list",
    tag: ["mikoko"]
  },
  {
    icon: "observation",
    title: "mikoko_citizen_science",
    link: "/observation/list",
    tag: ["mikoko"]
  },
  {
    icon: "documents",
    title: "literature",
    link: "/document/list",
    tag: ["ibp", "mikoko"]
  },
  {
    icon: "taxonomy",
    title: "taxonomy",
    link: "/taxonomy/list",
    tag: ["ibp"]
  },
  {
    icon: "landscapes",
    title: "landscapes",
    link: "/landscape",
    tag: ["ibp"]
  },
  {
    icon: "user-groups",
    title: "groups",
    link: "/user/list",
    tag: ["ibp"]
  },
  {
    icon: "open-data",
    title: "open_data",
    link: "/observation/list",
    tag: ["ibp", "mikoko"]
  }
];
