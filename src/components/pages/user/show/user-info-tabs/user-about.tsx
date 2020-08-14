import { SimpleGrid, Stack } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import ExternalBlueLinkList from "@components/@core/blue-link/external-list";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import { useStoreState } from "easy-peasy";
import React from "react";
import { format } from "timeago.js";

export default function UserAbout({ userDetails }) {
  const { isLoggedIn } = useStoreState((s) => s);

  const aboutLinks = [
    {
      title: "USER.ABOUT",
      value: userDetails.aboutMe
    },
    {
      title: "USER.LOCATION",
      value: userDetails.location
    },
    {
      title: "USER.WEBSITE",
      value: userDetails.website,
      cell: (
        <Stack isInline={false}>
          <ExternalBlueLinkList hrefs={userDetails?.website?.split(",")} />
        </Stack>
      )
    },
    {
      title: "USER.EMAIL",
      value: isLoggedIn,
      cell: <BlueLink href={`mailto:${userDetails.email}`}>{userDetails.email}</BlueLink>
    },
    {
      title: "USER.OCCUPATION",
      value: userDetails.occupation
    },
    {
      title: "USER.INSTITUTION",
      value: userDetails.institution
    },

    {
      title: "USER.JOINED",
      value: format(userDetails.dateCreated)
    },
    {
      title: "USER.LAST_ACTIVE",
      value: format(userDetails.lastLoginDate)
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
