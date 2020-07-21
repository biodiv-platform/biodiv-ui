import { LeaderboardFilterProps } from "@interfaces/custom";

export const LEADERBOARD_MODULES = {
  All: "",
  Observations: "observation",
  Species: "species",
  Discussion: "discussion",
  Documents: "document",
  Taxon: "taxon",
  Miscellaneous: "miscellaneous"
};

export const LEADERBOARD_STOPS = {
  today: "Today",
  week: "Past Week",
  month: "Past Month",
  month3: "Past 3 Months",
  year: "Past Year",
  f: "All Time"
};

export const LEADERBOARD_FILTERS: LeaderboardFilterProps = {
  module: "",
  period: "f",
  limit: 20
};
