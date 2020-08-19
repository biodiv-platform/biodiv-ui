import UserShowPageComponent from "@components/pages/user/show";
import { axGetUserById } from "@services/user.service";
import React from "react";

import Error from "../../_error";

const UserShowPage = ({ user, success }) =>
  success ? <UserShowPageComponent user={user} /> : <Error statusCode={404} />;

UserShowPage.getInitialProps = async (ctx) => {
  const { success, data } = await axGetUserById(ctx.query.userId, ctx);
  return { user: data, success };
};

export default UserShowPage;
