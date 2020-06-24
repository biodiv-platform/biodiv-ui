import { useLocalRouter } from "@components/@core/local-link";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { encode } from "base64-url";
import Router from "next/router";
import React, { useEffect } from "react";

export default function AuthRedirect() {
  const router = useLocalRouter();

  useEffect(() => {
    router.push(`/login?forward=${encode(router.asPath)}`);
  }, []);

  return <span></span>;
}

export const throwUnauthorized = (ctx) => {
  if (ctx.res) {
    ctx.res.writeHead(401, { "Content-Type": "text/html; charset=utf-8" });
    ctx.res.write("🍃 Unauthorized");
    ctx.res.end();
  }
};

/**
 * This function should be used in SSR based functions like `getInitialProps` etc.
 * - Don't use this function on open pages
 * - Always redirects to login if user is not logged in
 *
 * @param {Role[]} allowedRoles
 * @param {*} ctx
 * @param {boolean} [redirect=true]
 */
export const authorizedPageSSR = (
  allowedRoles: Role[],
  ctx,
  redirect = true,
  redirectNotLoggedIn = true
) => {
  const canRedirect = redirectNotLoggedIn
    ? hasAccess([Role.Any], ctx)
      ? redirect
      : true
    : redirect;

  if (!hasAccess(allowedRoles, ctx)) {
    if (canRedirect) {
      const Location = `/login?forward=${encode(ctx.asPath)}`;
      if (ctx.res) {
        ctx.res.writeHead(302, {
          Location,
          "Content-Type": "text/html; charset=utf-8"
        });
        ctx.res.end();
      } else {
        Router.push(Location);
      }
    } else {
      throwUnauthorized(ctx);
    }
  }
};
