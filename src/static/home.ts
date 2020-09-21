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

export const HERO_FALLBACK = `data:image/svg+xml,%3Csvg width='800' height='500' viewBox='0 0 800 500' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H800V500H0V0Z' fill='%23E2E8F0'/%3E%3Cpath d='M414 232H386C383.791 232 382 233.791 382 236V264C382 266.209 383.791 268 386 268H414C416.209 268 418 266.209 418 264V236C418 233.791 416.209 232 414 232Z' stroke='%23A0AEC0' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M393 246C394.657 246 396 244.657 396 243C396 241.343 394.657 240 393 240C391.343 240 390 241.343 390 243C390 244.657 391.343 246 393 246Z' stroke='%23A0AEC0' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M418 256L408 246L386 268' stroke='%23A0AEC0' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A`;
