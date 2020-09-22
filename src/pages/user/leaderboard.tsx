import UserLeaderboardComponent from "@components/pages/user/leaderboard";
import { LeaderboardFilterProvider } from "@components/pages/user/leaderboard/use-leaderboard-filter";
import { LEADERBOARD_FILTERS } from "@static/leaderboard";
import React from "react";

function UserLeaderboardPage({ initialFilterParams }) {
  return (
    <LeaderboardFilterProvider filter={initialFilterParams}>
      <UserLeaderboardComponent />
    </LeaderboardFilterProvider>
  );
}

UserLeaderboardPage.getInitialProps = async (ctx) => {
  const initialFilterParams = { ...LEADERBOARD_FILTERS, ...ctx.query };

  return {
    initialFilterParams
  };
};

export default UserLeaderboardPage;
