import { authorizedPageSSR, throwUnauthorized } from "@components/auth/auth-redirect";
import UserProfile from "@components/pages/user/show";
import { Role } from "@interfaces/custom";
import { axGetUserById } from "@services/user.service";
import React from "react";

const createGroup = ({ userDetails }) => <UserProfile userDetails={userDetails} />;

createGroup.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Admin], ctx, false);

  const { success: s1, data: userDetails } = await axGetUserById(ctx.query.userId, ctx);
  if (s1) {
    return {
      userDetails
    };
  } else {
    throwUnauthorized(ctx);
  }
};

export default createGroup;
