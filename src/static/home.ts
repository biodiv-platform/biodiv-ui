import discussions from "@components/pages/home/icons/discussions";
import documents from "@components/pages/home/icons/documents";
import landscapes from "@components/pages/home/icons/landscapes";
import maps from "@components/pages/home/icons/maps";
import observation from "@components/pages/home/icons/observation";
import openData from "@components/pages/home/icons/open-data";
import species from "@components/pages/home/icons/species";
import taxonomy from "@components/pages/home/icons/taxonomy";
import userGroups from "@components/pages/home/icons/userGroups";

export const CARD_META = {
  species: {
    icon: species,
    link: "/species/list",
    color: "#F64754"
  },
  observation: {
    icon: observation,
    link: "/observation/list",
    color: "#4299E1"
  },
  maps: {
    icon: maps,
    link: "/map",
    color: "#F6C04B"
  },
  documents: {
    icon: documents,
    link: "/document/list",
    color: "#AB73E1"
  },
  activeUser: {
    icon: userGroups,
    link: "/user/list",
    color: "#38B2AC"
  },
  discussions: {
    icon: discussions,
    link: "/discussion/list",
    color: "#82C68F"
  }
};

export const FEATURES = [
  {
    icon: species,
    title: "species_information",
    link: "/species/list"
  },
  {
    icon: observation,
    title: "citizen_science",
    link: "/observation/list"
  },
  {
    icon: maps,
    title: "maps",
    link: "/map"
  },
  {
    icon: documents,
    title: "literature",
    link: "/document/list"
  },
  {
    icon: taxonomy,
    title: "taxonomy",
    link: "/namelist/index"
  },
  {
    icon: landscapes,
    title: "landscapes",
    link: "/landscape"
  },
  {
    icon: userGroups,
    title: "groups",
    link: "/user/list"
  },
  {
    icon: openData,
    title: "open_data",
    link: "/observation/list"
  }
];
