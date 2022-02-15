import { Box } from "@chakra-ui/react";
import { authorizedPageSSR } from "@components/auth/auth-redirect";
import Curation from "@components/pages/curation";
import { Role } from "@interfaces/custom";
import { getParsedUser } from "@utils/auth";
import { userInfo } from "os";
import React from "react";

/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */

export default function CurationPage({ user }) {
  // console.log("roles are as follow");
  // console.log(Role);
  return (
    <Box className="container mt" pb={6}>
      <Curation user={user}/>
    </Box>
  );
}

CurationPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx);
  const user = getParsedUser(ctx);
  //console.log("here are the roles");
  //console.log(ctx);
  return { user };
};
