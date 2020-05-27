import { Select, Stack } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import { LEADERBOARD_MODULES, LEADERBOARD_STOPS } from "@static/constants";
import React, { useState } from "react";

import {
  LEADERBOARD_TABLE_COLUMNS,
  LEADERBOARD_TABLE_MODULES,
  LEADERBOARD_TABLE_SUB_MODULES
} from "./columns";
import Info from "./info";
import UserLeaderboardTable from "./table";

const STOPS = [20, 100, 200, 500];

function UserLeaderboardComponent() {
  const [limit, setLimit] = useState(STOPS[0]);
  const [mod, setMod] = useState(LEADERBOARD_MODULES[Object.keys(LEADERBOARD_MODULES)[0]]);
  const [time, setTime] = useState(
    Object.keys(LEADERBOARD_STOPS)[Object.keys(LEADERBOARD_STOPS).length - 1]
  );
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <PageHeading
        actions={
          <Stack isInline={true} alignItems="center" spacing={4}>
            <Select minW="8rem" onChange={(e) => setMod(e.target.value)} defaultValue={mod}>
              {Object.keys(LEADERBOARD_MODULES).map((key, index) => (
                <option key={index} value={LEADERBOARD_MODULES[key]}>
                  {key}
                </option>
              ))}
            </Select>
            <Select minW="8rem" onChange={(e) => setTime(e.target.value)} defaultValue={time}>
              {Object.keys(LEADERBOARD_STOPS).map((key, index) => (
                <option key={index} value={key}>
                  {LEADERBOARD_STOPS[key]}
                </option>
              ))}
            </Select>
            <Select onChange={(e) => setLimit(+e.target.value)} value={limit}>
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
        module={mod}
        limit={limit}
        time={time}
        columns={[
          ...LEADERBOARD_TABLE_COLUMNS,
          ...(mod.length == 0 ? LEADERBOARD_TABLE_MODULES : LEADERBOARD_TABLE_SUB_MODULES(mod))
        ]}
      />
    </div>
  );
}

export default UserLeaderboardComponent;
