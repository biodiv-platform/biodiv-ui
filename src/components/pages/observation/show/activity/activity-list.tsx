import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import BlueLink from "@components/@core/blue-link";
import BoxHeading from "@components/@core/layout/box-heading";
import Tooltip from "@components/@core/tooltip";
import Badge from "@components/@core/user/badge";
import useActivity from "@hooks/use-activity";
import useGlobalState from "@hooks/use-global-state";
import { axDeleteObservationComment } from "@services/activity.service";
import { ACTIVITY_UPDATED } from "@static/events";
import { adminOrAuthor } from "@utils/auth";
import { toKey } from "@utils/basic";
import { formatTimeStampFromUTC, timeAgoUTC } from "@utils/date";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { useListener } from "react-gbus";

import ACTIVITY_TYPE from "./activity-types";
import ContentBox from "./content-box";

export default function ActivityList({ resourceId, resourceType, title = "common:activity" }) {
  const { t } = useTranslation();
  const activity = useActivity(resourceId, resourceType);

  const { languageId } = useGlobalState();

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

  const ActivityType = ({ activityData }) => {
    if (activityData?.recoVote?.source) {
      return (
        <Text color="gray.600" as="i">
          {t(`activity:${toKey(activityData.activityIbp.activityType).toLowerCase()}`) +
            " (via " +
            activityData.recoVote.source +
            ")"}
        </Text>
      );
    } else {
      const at = activityData?.activityIbp?.activityType;

      switch (at) {
        case ACTIVITY_TYPE.POSTED_RESOURCE:
        case ACTIVITY_TYPE.REMOVED_RESORUCE:
        case ACTIVITY_TYPE.FEATURED:
        case ACTIVITY_TYPE.UNFEATURED:
          const ad1 = JSON.parse(activityData?.activityIbp?.activityDescription || "{}");
          return (
            <Text color="gray.600" as="i">
              {t(`activity:${toKey(activityData?.activityIbp.activityType).toLowerCase()}`) +
                (ad1?.reason ? ` (${ad1.reason})` : "")}
            </Text>
          );
        default:
          return (
            <Text color="gray.600" as="i">
              {t(`activity:${toKey(activityData?.activityIbp.activityType).toLowerCase()}`)}
            </Text>
          );
      }
    }
  };

  return (
    <>
      <BoxHeading subTitle={`${activity.data.commentCount} ${t("form:comments.title")}`}>
        🕒 {t(title)}
      </BoxHeading>
      {activity.data.list.map((a: any) => (
        <Stack
          key={a?.activityIbp?.dateCreated}
          isInline={true}
          spacing={3}
          p={4}
          borderBottom="1px"
          borderColor="gray.300"
          className="fade"
        >
          <Avatar
            size="sm"
            name={a.userIbp.name}
            src={getUserImage(a.userIbp.profilePic, a.userIbp.name)}
          />
          <Box>
            <BlueLink fontWeight="bold" mr={2} href={`/user/show/${a.userIbp.id}`}>
              {a.userIbp.name} <Badge isAdmin={a.userIbp.isAdmin} />
            </BlueLink>
            <ActivityType activityData={a} />
            <ContentBox activity={a} />
            <Box>
              <Tooltip title={formatTimeStampFromUTC(a.activityIbp.lastUpdated)} hasArrow={true}>
                <Text color="gray.600" as="small">
                  {timeAgoUTC(a.activityIbp.lastUpdated)}
                </Text>
              </Tooltip>
            </Box>
          </Box>
          {a?.activityIbp?.activityType == ACTIVITY_TYPE.ADDED_A_COMMENT &&
            adminOrAuthor(a.userIbp.id) && (
              <DeleteActionButton
                observationId={a?.commentsIbp?.id}
                title="Delete comment"
                description="Are you sure you want to delete this comment?"
                deleted="comment removed successfully"
                deleteFunc={axDeleteObservationComment}
                refreshActivity={activity.refresh}
                deleteComment={true}
                commentDeletePayload={{
                  body: a?.commentsIbp?.body,
                  languageId: languageId,
                  rootHolderId: resourceId,
                  rootHolderType: resourceType,
                  subRootHolderId: null,
                  subRootHolderType: null
                }}
              />
            )}
        </Stack>
      ))}
      {activity.data.hasMore && (
        <Button
          w="full"
          rounded={0}
          isLoading={activity.isLoading}
          onClick={() => loadActivity(false)}
        >
          {t("activity:load_more_activity")}
        </Button>
      )}
    </>
  );
}
