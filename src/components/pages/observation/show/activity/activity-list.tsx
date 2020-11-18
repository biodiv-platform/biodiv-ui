import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import BoxHeading from "@components/@core/layout/box-heading";
import Tooltip from "@components/@core/tooltip";
import Badge from "@components/@core/user/badge";
import useActivity from "@hooks/use-activity";
import useTranslation from "@hooks/use-translation";
import { ACTIVITY_UPDATED } from "@static/events";
import { toKey } from "@utils/basic";
import { formatTimeStampFromUTC, timeAgoUTC } from "@utils/date";
import { getUserImage } from "@utils/media";
import React, { useEffect } from "react";
import { useListener } from "react-gbus";

import ContentBox from "./content-box";

export default function ActivityList({ resourceId, resourceType, title = "OBSERVATION.ACTIVITY" }) {
  const { t } = useTranslation();
  const activity = useActivity();

  const loadActivity = (reset) => {
    activity.loadMore(resourceType, resourceId, reset);
  };

  useEffect(() => {
    loadActivity(true);
  }, []);

  useListener(
    (oId) => {
      if (oId === resourceId) {
        loadActivity(true);
      }
    },
    [ACTIVITY_UPDATED]
  );

  const ActivityType = ({ type }) => (
    <Text color="gray.600" as="i">
      {t(`ACTIVITY_TYPE.${toKey(type)}`)}
    </Text>
  );

  return (
    <>
      <BoxHeading subTitle={`${activity.data.commentCount} ${t("OBSERVATION.COMMENTS.TITLE")}`}>
        🕒 {t(title)}
      </BoxHeading>
      {activity.data.list.map((a, index) => (
        <Stack
          key={index}
          isInline={true}
          spacing={3}
          p={4}
          borderBottom="1px"
          borderColor="gray.300"
          className="fade"
        >
          <Avatar size="sm" name={a.userIbp.name} src={getUserImage(a.userIbp.profilePic)} />
          <Box>
            <BlueLink fontWeight="bold" mr={2} href={`/user/show/${a.userIbp.id}`}>
              {a.userIbp.name} <Badge isAdmin={a.userIbp.isAdmin} />
            </BlueLink>
            <ActivityType type={a.activityIbp.activityType} />
            <ContentBox activity={a} />
            <Box>
              <Tooltip title={formatTimeStampFromUTC(a.activityIbp.lastUpdated)} hasArrow={true}>
                <Text color="gray.600" as="small">
                  {timeAgoUTC(a.activityIbp.lastUpdated)}
                </Text>
              </Tooltip>
            </Box>
          </Box>
        </Stack>
      ))}
      {activity.data.hasMore && (
        <Button
          w="full"
          rounded={0}
          isLoading={activity.isLoading}
          onClick={() => loadActivity(false)}
        >
          {t("OBSERVATION.LOAD_MORE_ACTIVITY")}
        </Button>
      )}
    </>
  );
}
