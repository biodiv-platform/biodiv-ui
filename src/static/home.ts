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
    title: "SPECIES_INFORMATION",
    link: "/species/list"
  },
  {
    icon: observation,
    title: "CITIZEN_SCIENCE",
    link: "/observation/list"
  },
  {
    icon: maps,
    title: "MAPS",
    link: "/map"
  },
  {
    icon: documents,
    title: "LITERATURE",
    link: "/document/list"
  },
  {
    icon: taxonomy,
    title: "TAXONOMY",
    link: "/namelist/index"
  },
  {
    icon: landscapes,
    title: "LANDSCAPES",
    link: "/landscape"
  },
  {
    icon: userGroups,
    title: "GROUPS",
    link: "/user/list"
  },
  {
    icon: openData,
    title: "OPEN_DATA",
    link: "/observation/list"
  }
];
