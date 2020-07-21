import { ENDPOINT } from "@static/constants";
import { plainHttp } from "@utils/http";
import notification from "@utils/notification";

export const axSearchSpeciesByText = async (text, field) => {
  try {
    const { data } = await plainHttp.get(`${ENDPOINT.ESMODULE}/v1/services/auto-complete/etd/er`, {
      params: { text, field }
    });
    return { success: true, data };
  } catch (e) {
    notification(e.response.data.message);
    return { success: false, data: [] };
  }
};

export const axGetUserLeaderboard = async (payload, authorId = -1) => {
  const index = "eaf";
  const type = "er";
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.ESMODULE}/v1/services/leaderboard/${index}/${type}`,
      {
        params: payload
      }
    );
    const leaderboardRanked = data.map((o, i) => ({ ...o, rank: i + 1 }));

    if (authorId > 0) {
      let hasCurrentUser = false;

      const filteredList = leaderboardRanked.reduce((acc, o) => {
        if (Number(o.details.author_id) === authorId) {
          hasCurrentUser = true;
          return [o, ...acc];
        }
        return [...acc, o];
      }, []);

      if (hasCurrentUser) {
        return filteredList;
      } else {
        const res = await plainHttp.get(`${ENDPOINT.ESMODULE}/v1/services/userscore`, {
          params: { index, type, authorId }
        });
        return [...res.data?.record, ...leaderboardRanked];
      }
    }
    return leaderboardRanked;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const axSearchFilterByName = async (text, field) => {
  try {
    const { data } = await plainHttp.get(
      `${ENDPOINT.ESMODULE}/v1/services/filterautocomplete/eo/er`,
      {
        params: { text, field }
      }
    );
    return data.map((i) => ({ value: i, label: i }));
  } catch (e) {
    notification(e.response.data.message);
    return [];
  }
};
