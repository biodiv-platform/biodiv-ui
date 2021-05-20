import { Box, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import useTranslation from "@hooks/use-translation";
import { ShowActivityIbp } from "@interfaces/activity";
import React from "react";

import LinkTag from "../../common/link-tag";
import ACTIVITY_TYPE from "./activity-types";
import CommentRender from "./comment-render";

const ContentBox = ({ activity }: { activity: ShowActivityIbp }) => {
  const { t } = useTranslation();

  const at = activity.activityIbp?.activityType;

  switch (at) {
    case ACTIVITY_TYPE.ADDED_A_COMMENT:
      return <CommentRender html={activity?.commentsIbp?.body} />;

    case ACTIVITY_TYPE.POSTED_RESOURCE:
    case ACTIVITY_TYPE.REMOVED_RESORUCE:
    case ACTIVITY_TYPE.FEATURED:
    case ACTIVITY_TYPE.UNFEATURED:
      const ad1 = JSON.parse(activity.activityIbp?.activityDescription || "{}");
      return (
        <Box>
          <BlueLink href={ad1?.webAddress}>{ad1?.userGroupName}</BlueLink>
          {ad1?.reason && (
            <Text color="gray.600" fontSize="sm" fontStyle="italic">
              ({ad1.reason})
            </Text>
          )}
          {at !== ACTIVITY_TYPE.UNFEATURED && <Text as="p">{ad1?.featured}</Text>}
        </Box>
      );

    case ACTIVITY_TYPE.SUGGESTED_SPECIES_NAME:
    case ACTIVITY_TYPE.SUGGESTION_REMOVED:
    case ACTIVITY_TYPE.AGREED_ON_SPECIES_NAME:
    case ACTIVITY_TYPE.OBV_LOCKED:
    case ACTIVITY_TYPE.OBV_UNLOCKED:
      const ad2 = JSON.parse(activity.activityIbp?.activityDescription || "{}");
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
      const tags = activity.activityIbp?.activityDescription?.split(",") || [];
      return (
        <Box mt={2}>
          {tags.map((tag) => (
            <LinkTag key={tag} label={tag} />
          ))}
        </Box>
      );

    case ACTIVITY_TYPE.FLAGGED:
    case ACTIVITY_TYPE.FLAG_REMOVED:
      const desc = activity?.activityIbp?.activityDescription;
      const [flagType, flagInfo]: any = desc?.split(/:(.+)/);
      const html = `${t(`ACTIONS.FLAG.FLAGS.${flagType}`)}: ${flagInfo}`;
      return <CommentRender html={html} />;

    case ACTIVITY_TYPE.RATED_MEDIA_RESOURCE:
      return <></>;

    default:
      return (
        <Box>
          <Box>{activity?.activityIbp?.activityDescription}</Box>
        </Box>
      );
  }
};

export default ContentBox;
