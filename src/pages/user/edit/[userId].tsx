import UserEditPageComponent from "@components/pages/user/edit";
import { Role } from "@interfaces/custom";
import { axGetUserById } from "@services/user.service";
import { adminOrAuthor, hasAccess } from "@utils/auth";
import React from "react";

import Error from "../../_error";

const UserEditPage = ({ user, errorCode, isAdmin }) =>
  errorCode ? (
    <Error statusCode={errorCode} />
  ) : (
    <UserEditPageComponent user={user} isAdmin={isAdmin} />
  );

UserEditPage.getInitialProps = async (ctx) => {
  const { success, data: user } = await axGetUserById(ctx.query.userId, ctx);
  const errorCode = success ? (adminOrAuthor(user?.id, ctx) ? null : 401) : 404;
  const isAdmin = hasAccess([Role.Admin], ctx);
  return { user, isAdmin, errorCode };
};

export default UserEditPage;
