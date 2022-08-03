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
 * - use `authorizedPageSSP` if you want to use it with `getServerSideProps`
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
      const Location = `/login?forward=${encode(ctx?.asPath || ctx?.resolvedUrl)}`;
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

/**
 * Improved version of `authorizedPageSSR` redirects to login if user is not authorized
 *
 * @param {*} allowedRoles
 * @param {*} ctx
 * @return {*}
 */
export const authorizedPageSSP = (allowedRoles, ctx) => {
  const isLoggedIn = hasAccess([Role.Any], ctx);

  if (!hasAccess(allowedRoles, ctx)) {
    if (isLoggedIn) throwUnauthorized(ctx);

    return {
      redirect: {
        permanant: false,
        destination: `/login?forward=${encode(ctx?.asPath || ctx?.resolvedUrl)}`
      },
      props: {}
    };
  }
};
