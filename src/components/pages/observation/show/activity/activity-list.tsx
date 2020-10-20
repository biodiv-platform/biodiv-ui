import { Avatar, Box, Button, Stack, Text } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import BoxHeading from "@components/@core/layout/box-heading";
import Tooltip from "@components/@core/tooltip";
import Badge from "@components/@core/user/badge";
import useTranslation from "@hooks/use-translation";
import { ShowActivityIbp } from "@interfaces/activity";
import { ACTIVITY_UPDATED } from "@static/events";
import { useActivityStore } from "@stores/activity.store";
import { toKey } from "@utils/basic";
import { formatTimeStamp } from "@utils/date";
import { getUserImage } from "@utils/media";
import React, { useEffect } from "react";
import { useListener } from "react-gbus";
import { format } from "timeago.js";

import LinkTag from "../../common/link-tag";
import ACTIVITY_TYPE from "./activity-types";
import CommentRender from "./comment-render";

export default function ActivityList({ resourceId, resourceType, title = "OBSERVATION.ACTIVITY" }) {
  const [state, actions] = useActivityStore();
  const { t } = useTranslation();

  const loadActivity = (reset) => {
    actions.listActivity({ objectType: resourceType, objectId: resourceId, reset });
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

  const ActivityBoxContent = ({ a }: { a: ShowActivityIbp }) => {
    const at = a.activityIbp.activityType;

    switch (at) {
      case ACTIVITY_TYPE.ADDED_A_COMMENT:
        return <CommentRender html={a?.commentsIbp?.body} />;

      case ACTIVITY_TYPE.POSTED_RESOURCE:
      case ACTIVITY_TYPE.REMOVED_RESORUCE:
      case ACTIVITY_TYPE.FEATURED:
      case ACTIVITY_TYPE.UNFEATURED:
        const ad1 = JSON.parse(a.activityIbp?.activityDescription);
        return (
          <Box>
            <BlueLink href={ad1?.webAddress}>{ad1?.userGroupName}</BlueLink>
            {at !== ACTIVITY_TYPE.UNFEATURED && <Text as="p">{ad1?.featured}</Text>}
          </Box>
        );

      case ACTIVITY_TYPE.SUGGESTED_SPECIES_NAME:
      case ACTIVITY_TYPE.SUGGESTION_REMOVED:
      case ACTIVITY_TYPE.AGREED_ON_SPECIES_NAME:
      case ACTIVITY_TYPE.OBV_LOCKED:
      case ACTIVITY_TYPE.OBV_UNLOCKED:
        const ad2 = JSON.parse(a.activityIbp?.activityDescription);
        const link = ad2?.speciesId ? `/species/show/${ad2?.speciesId}` : null;
        const content = (
          <>
            {ad2?.scientificName} {ad2?.commonName && `(${ad2?.commonName})`}
          </>
        );
        return (
          <Box>
            {link ? <BlueLink href={link}>{content}</BlueLink> : content}
            {ad2?.givenName && <Text as="p">Given name is {ad2.givenName}</Text>}
          </Box>
        );

      case ACTIVITY_TYPE.DOCUMENT_TAG_UPDATED:
      case ACTIVITY_TYPE.OBSERVATION_TAG_UPDATED:
        const tags = a.activityIbp?.activityDescription.split(",") || [];
        return (
          <Box mt={2}>
            {tags.map((tag) => (
              <LinkTag key={tag} label={tag} />
            ))}
          </Box>
        );

      case ACTIVITY_TYPE.FLAGGED:
      case ACTIVITY_TYPE.FLAG_REMOVED:
        const desc = a?.activityIbp?.activityDescription;
        const [flagType, flagInfo] = desc.split(":");
        return (
          <Box>
            {t(`ACTIONS.FLAG.FLAGS.${flagType}`)}: {flagInfo}
          </Box>
        );

      case ACTIVITY_TYPE.RATED_MEDIA_RESOURCE:
        return <></>;

      default:
        return (
          <Box>
            <Box>{a?.activityIbp?.activityDescription}</Box>
          </Box>
        );
    }
  };

  // console.log("the aciticuty state",state)

  return (
    <>
      <BoxHeading subTitle={`${state.commentCount} ${t("OBSERVATION.COMMENTS.TITLE")}`}>
        🕒 {t(title)}
      </BoxHeading>
      {state.activity.map((a, index) => (
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
            <ActivityBoxContent a={a} />
            <Box>
              <Tooltip title={formatTimeStamp(a.activityIbp.lastUpdated)} hasArrow={true}>
                <Text color="gray.600" as="small">
                  {format(a.activityIbp.lastUpdated)}
                </Text>
              </Tooltip>
            </Box>
          </Box>
        </Stack>
      ))}
      {state.hasMore && (
        <Button w="full" rounded={0} onClick={() => loadActivity(false)}>
          {t("OBSERVATION.LOAD_MORE_ACTIVITY")}
        </Button>
      )}
    </>
  );
}
