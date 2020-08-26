import { SimpleGrid, Stack } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import ExternalBlueLinkList from "@components/@core/blue-link/external-list";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import useGlobalState from "@hooks/useGlobalState";
import React from "react";
import { format } from "timeago.js";

import { UserProfileProps } from "..";

export default function UserAbout({ user }: UserProfileProps) {
  const { isLoggedIn } = useGlobalState();

  const aboutLinks = [
    {
      title: "USER.ABOUT",
      value: user.aboutMe
    },
    {
      title: "USER.LOCATION",
      value: user.location
    },
    {
      title: "USER.WEBSITE",
      value: user.website,
      cell: (
        <Stack isInline={false}>
          <ExternalBlueLinkList hrefs={user?.website?.split(",")} />
        </Stack>
      )
    },
    {
      title: "USER.EMAIL",
      value: isLoggedIn,
      cell: <BlueLink href={`mailto:${user.email}`}>{user.email}</BlueLink>
    },
    {
      title: "USER.OCCUPATION",
      value: user.occupation
    },
    {
      title: "USER.INSTITUTION",
      value: user.institution
    },

    {
      title: "USER.JOINED",
      value: format(user.dateCreated)
    },
    {
      title: "USER.LAST_ACTIVE",
      value: format(user.lastLoginDate)
    }
  ];

  return (
    <SimpleGrid columns={[1, 1, 5, 5]} spacing={2}>
      {aboutLinks.map(({ title, value, cell }) =>
        value ? (
          <ResponsiveInfo key={title} title={title}>
            {cell || value}
          </ResponsiveInfo>
        ) : null
      )}
    </SimpleGrid>
  );
}
