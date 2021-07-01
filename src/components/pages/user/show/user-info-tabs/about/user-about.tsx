import { SimpleGrid, Stack } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import ExternalBlueLinkList from "@components/@core/blue-link/external-list";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import useGlobalState from "@hooks/use-global-state";
import { timeAgoUTC } from "@utils/date";
import React from "react";

import { UserProfileProps } from "../../";

export default function UserAbout({ user }: UserProfileProps) {
  const { isLoggedIn } = useGlobalState();

  const aboutLinks = [
    {
      title: "user:about",
      value: user.aboutMe
    },
    {
      title: "user:location",
      value: user.location
    },
    {
      title: "user:website",
      value: user.website,
      cell: (
        <Stack isInline={false}>
          <ExternalBlueLinkList hrefs={user?.website?.split(",")} />
        </Stack>
      )
    },
    {
      title: "user:email",
      value: isLoggedIn,
      cell: <BlueLink href={`mailto:${user.email}`}>{user.email}</BlueLink>
    },
    {
      title: "user:occupation",
      value: user.occupation
    },
    {
      title: "user:institution",
      value: user.institution
    },

    {
      title: "user:joined",
      value: timeAgoUTC(user.dateCreated)
    },
    {
      title: "user:last_active",
      value: timeAgoUTC(user.lastLoginDate)
    }
  ];

  return (
    <SimpleGrid className="white-box" columns={[1, 1, 5, 5]} spacing={2} p={4}>
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
