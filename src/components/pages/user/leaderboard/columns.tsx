import { Stack } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import { getUserImage } from "@utils/media";
import { format } from "indian-number-format";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Avatar } from "@/components/ui/avatar";

const ObservationCell = (props) => {
  const values: any = Object.values(props?.cell?.value || {});
  const total = values.reduce((cv, t) => (t ? +cv + +t : cv), 0);
  return format(total, 3);
};

const CommonStatCell = (props) => {
  const {
    commented = 0,
    contributed = 0,
    organized = 0,
    curated = 0,
    identified = 0
  } = props?.cell?.value || {};
  return format(+commented + +contributed + +organized + +curated + +identified);
};

const FormattedCell = (props) => {
  return format(+props?.cell?.value || 0);
};

export const LEADERBOARD_MODULES_COLUMNS = [
  {
    Header: "leaderboard:table.observation",
    accessor: "observation",
    Cell: ObservationCell
  },
  {
    Header: "leaderboard:table.species",
    accessor: "species",
    Cell: CommonStatCell
  },
  {
    Header: "leaderboard:table.discussions",
    accessor: "discussion",
    Cell: CommonStatCell
  },
  {
    Header: "leaderboard:table.documents",
    accessor: "document",
    Cell: CommonStatCell
  }
];

export const LEADERBOARD_SUB_MODULES_COLUMNS = (props) => {
  return [
    {
      Header: `leaderboard:total.${props.toLowerCase()}`,
      accessor: `${props}`,
      Cell: CommonStatCell
    },
    {
      Header: "leaderboard:table.created",
      accessor: `${props}.contributed`,
      Cell: FormattedCell
    },
    {
      Header: "leaderboard:table.curated",
      accessor: `${props}.curated`,
      Cell: FormattedCell
    },
    {
      Header: "leaderboard:table.identified",
      accessor: `${props}.identified`,
      Cell: FormattedCell
    },
    {
      Header: "leaderboard:table.organized",
      accessor: `${props}.organized`,
      Cell: FormattedCell
    },
    {
      Header: "leaderboard:table.commented",
      accessor: `${props}.commented`,
      Cell: FormattedCell
    }
  ];
};

export const LEADERBOARD_TABLE_COLUMNS = [
  {
    Header: "leaderboard:table.rank",
    accessor: "rank",
    Cell: (props) => props?.cell?.value || "NA"
  },
  {
    Header: "leaderboard:table.name",
    accessor: "details",
    Cell: (props) => {
      const { t } = useTranslation();

      return (
        <Stack direction={"row"} gap={2} minW="12rem">
          <Avatar
            size="md"
            name={props?.cell?.value?.authorName}
            src={getUserImage(props?.cell?.value?.profilePic, props?.cell?.value?.authorName)}
          />
          <div>
            <BlueLink href={`/user/show/${props?.cell?.value?.author_id}`}>
              {props?.cell?.value?.authorName}
            </BlueLink>
            <br />
            <span>{[t("leaderboard:activity_score"), props?.cell?.value?.activity_score]}</span>
          </div>
        </Stack>
      );
    }
  }
];
