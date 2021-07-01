import { Select, Stack } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { LEADERBOARD_MODULES, LEADERBOARD_STOPS } from "@static/leaderboard";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  LEADERBOARD_MODULES_COLUMNS,
  LEADERBOARD_SUB_MODULES_COLUMNS,
  LEADERBOARD_TABLE_COLUMNS
} from "./columns";
import Info from "./info";
import UserLeaderboardTable from "./table";
import useLeaderboardFilter from "./use-leaderboard-filter";

const STOPS = [20, 100, 200, 500];

function UserLeaderboardComponent() {
  const { setFilter, filter } = useLeaderboardFilter();
  const { t } = useTranslation();

  const onChange = (key, value) => {
    setFilter((_draft) => {
      _draft.f[key] = value;
    });
  };

  return (
    <div className="container mt">
      <PageHeading
        actions={
          <Stack isInline={true} alignItems="center" spacing={4}>
            <Select
              minW="8rem"
              onChange={(event) => onChange("module", event.target.value)}
              defaultValue={filter?.module}
            >
              {LEADERBOARD_MODULES.map((option) => (
                <option key={option.label} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </Select>
            <Select
              minW="10rem"
              onChange={(event) => onChange("period", event.target.value)}
              defaultValue={filter?.period}
            >
              {LEADERBOARD_STOPS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </Select>
            <Select
              onChange={(event) => onChange("limit", event.target.value)}
              value={filter?.limit}
            >
              {STOPS.map((stop) => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))}
            </Select>
          </Stack>
        }
      >
        🏅 {t("leaderboard:title")}
      </PageHeading>
      <Info />
      <UserLeaderboardTable
        columns={[
          ...LEADERBOARD_TABLE_COLUMNS,
          ...(!filter?.module.length
            ? LEADERBOARD_MODULES_COLUMNS
            : LEADERBOARD_SUB_MODULES_COLUMNS(filter.module))
        ]}
      />
    </div>
  );
}

export default UserLeaderboardComponent;
