import { Select, Stack } from "@chakra-ui/core";
import { PageHeading } from "@components/@core/layout";
import useTranslation from "@configs/i18n/useTranslation";
import useLeaderboardFilter from "@hooks/useLeaderboardFilter";
import { LEADERBOARD_MODULES, LEADERBOARD_STOPS } from "@static/constants";
import React from "react";
import {
  LEADERBOARD_TABLE_COLUMNS,
  LEADERBOARD_TABLE_MODULES,
  LEADERBOARD_TABLE_SUB_MODULES
} from "./columns";
import Info from "./info";
import UserLeaderboardTable from "./table";

const STOPS = [20, 100, 200, 500];

function UserLeaderboardComponent() {
  const { setFilter, filter } = useLeaderboardFilter();
  const { t } = useTranslation();

  const onChangeModule = (v) => {
    setFilter((_draft) => {
      _draft.f.module = v.target.value;
    });
  };

  const onChangeTime = (v) => {
    setFilter((_draft) => {
      _draft.f.period = v.target.value;
    });
  };

  const onChangeCount = (v) => {
    setFilter((_draft) => {
      _draft.f.limit = +v.target.value;
    });
  };

  return (
    <div className="container mt">
      <PageHeading
        actions={
          <Stack isInline={true} alignItems="center" spacing={4}>
            <Select minW="8rem" onChange={onChangeModule} defaultValue={filter.module}>
              {Object.keys(LEADERBOARD_MODULES).map((key, index) => (
                <option key={index} value={LEADERBOARD_MODULES[key]}>
                  {key}
                </option>
              ))}
            </Select>
            <Select minW="8rem" onChange={onChangeTime} defaultValue={filter.period}>
              {Object.keys(LEADERBOARD_STOPS).map((key, index) => (
                <option key={index} value={key}>
                  {LEADERBOARD_STOPS[key]}
                </option>
              ))}
            </Select>
            <Select onChange={onChangeCount} value={filter.limit}>
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
          ...(filter.module.length == 0
            ? LEADERBOARD_TABLE_MODULES
            : LEADERBOARD_TABLE_SUB_MODULES(filter.module))
        ]}
      />
    </div>
  );
}

export default UserLeaderboardComponent;
