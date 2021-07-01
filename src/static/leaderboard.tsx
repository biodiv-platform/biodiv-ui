import { LeaderboardFilterProps } from "@interfaces/custom";

export const LEADERBOARD_MODULES = [
  { label: "leaderboard:modules.all", value: "" },
  { label: "leaderboard:modules.observations", value: "observation" },
  { label: "leaderboard:modules.species", value: "species" },
  { label: "leaderboard:modules.discussion", value: "discussion" },
  { label: "leaderboard:modules.documents", value: "document" },
  { label: "leaderboard:modules.taxon", value: "taxon" },
  { label: "leaderboard:modules.miscellaneous", value: "miscellaneous" }
];

export const LEADERBOARD_STOPS = [
  { label: "leaderboard:stops.today", value: "today" },
  { label: "leaderboard:stops.week", value: "week" },
  { label: "leaderboard:stops.month", value: "month" },
  { label: "leaderboard:stops.month3", value: "month3" },
  { label: "leaderboard:stops.year", value: "year" },
  { label: "leaderboard:stops.f", value: "f" }
];

export const LEADERBOARD_FILTERS: LeaderboardFilterProps = {
  module: "",
  period: "f",
  limit: 20
};
