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

export const authorizedPageSSR = (allowedRoles: Role[], ctx, redirect = true) => {
  if (!hasAccess(allowedRoles, ctx)) {
    if (redirect) {
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
