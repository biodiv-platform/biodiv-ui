import UserProfile from "@components/pages/user/show";
import { axGetUserById } from "@services/user.service";
import React from "react";

const createGroup = ({ userDetails }) => <UserProfile userDetails={userDetails} />;

createGroup.getInitialProps = async (ctx) => {
  const { data } = await axGetUserById(ctx.query.userId, ctx);
  return { userDetails: data };
};

export default createGroup;
