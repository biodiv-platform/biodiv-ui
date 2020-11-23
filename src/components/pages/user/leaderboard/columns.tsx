import { Avatar, Stack } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import LocalLink from "@components/@core/local-link";
import { getUserImage } from "@utils/media";
import { format } from "indian-number-format";
import React from "react";

const ObservationCell = (props) => {
  const values = Object.values(props?.cell?.value || {});
  const total = values.reduce((cv, t) => (t ? +cv + +t : cv), 0);
  return format(total, 3);
};

const CommonStatCell = (props) => {
  const { commented = 0, contributed = 0, organized = 0, curated = 0, identified = 0 } =
    props?.cell?.value || {};
  return format(+commented + +contributed + +organized + +curated + +identified);
};

const FormattedCell = (props) => {
  return format(+props?.cell?.value || 0);
};

export const LEADERBOARD_MODULES_COLUMNS = [
  {
    Header: "Observation",
    accessor: "observation",
    Cell: ObservationCell
  },
  {
    Header: "Species",
    accessor: "species",
    Cell: CommonStatCell
  },
  {
    Header: "Discussions",
    accessor: "discussion",
    Cell: CommonStatCell
  },
  {
    Header: "Documents",
    accessor: "document",
    Cell: CommonStatCell
  }
];

export const LEADERBOARD_SUB_MODULES_COLUMNS = (props) => {
  return [
    {
      Header: `${props} Total`,
      accessor: `${props}`,
      Cell: CommonStatCell
    },
    {
      Header: "Created",
      accessor: `${props}.contributed`,
      Cell: FormattedCell
    },
    {
      Header: "Curated",
      accessor: `${props}.curated`,
      Cell: FormattedCell
    },
    {
      Header: "Identified",
      accessor: `${props}.identified`,
      Cell: FormattedCell
    },
    {
      Header: "Organized",
      accessor: `${props}.organized`,
      Cell: FormattedCell
    },
    {
      Header: "Commented",
      accessor: `${props}.commented`,
      Cell: FormattedCell
    }
  ];
};

export const LEADERBOARD_TABLE_COLUMNS = [
  {
    Header: "Rank",
    accessor: "rank",
    Cell: (props) => props?.cell?.value || "NA"
  },
  {
    Header: "Name",
    accessor: "details",
    Cell: (props) => (
      <Stack isInline={true} spacing={2} minW="12rem">
        <Avatar
          size="md"
          name={props?.cell?.value?.authorName}
          src={getUserImage(props?.cell?.value?.profilePic)}
        ></Avatar>
        <div>
          <LocalLink href={`/user/show/${props?.cell?.value?.author_id}`}>
            <BlueLink>{props?.cell?.value?.authorName}</BlueLink>
          </LocalLink>
          <br />
          <span>{["Activity Score: ", props?.cell?.value?.activity_score]}</span>
        </div>
      </Stack>
    )
  }
];
