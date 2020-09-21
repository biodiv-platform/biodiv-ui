import { Select, Stack } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import { LEADERBOARD_MODULES, LEADERBOARD_STOPS } from "@static/leaderboard";
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
              defaultValue={filter.module}
            >
              {Object.keys(LEADERBOARD_MODULES).map((key, index) => (
                <option key={index} value={LEADERBOARD_MODULES[key]}>
                  {key}
                </option>
              ))}
            </Select>
            <Select
              minW="8rem"
              onChange={(event) => onChange("period", event.target.value)}
              defaultValue={filter.period}
            >
              {Object.keys(LEADERBOARD_STOPS).map((key, index) => (
                <option key={index} value={key}>
                  {LEADERBOARD_STOPS[key]}
                </option>
              ))}
            </Select>
            <Select
              onChange={(event) => onChange("limit", event.target.value)}
              value={filter.limit}
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
        🏅 {t("LEADERBOARD.TITLE")}
      </PageHeading>
      <Info />
      <UserLeaderboardTable
        columns={[
          ...LEADERBOARD_TABLE_COLUMNS,
          ...(!filter.module.length
            ? LEADERBOARD_MODULES_COLUMNS
            : LEADERBOARD_SUB_MODULES_COLUMNS(filter.module))
        ]}
      />
    </div>
  );
}

export default UserLeaderboardComponent;
