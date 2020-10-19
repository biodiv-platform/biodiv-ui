import UserShowPageComponent from "@components/pages/user/show";
import { axGetUserById } from "@services/user.service";
import React from "react";

import Error from "../../_error";

const UserShowPage = ({ user, success }) =>
  success ? <UserShowPageComponent user={user} /> : <Error statusCode={404} />;

export const getServerSideProps = async (ctx) => {
  const { success, data: user } = await axGetUserById(ctx.query.userId, ctx);
  return { props: { user, success } };
};

export default UserShowPage;
