import { Box } from "@chakra-ui/react";
import { authorizedPageSSR } from "@components/auth/auth-redirect";
import Curation from "@components/pages/curation";
import { Role } from "@interfaces/custom";
import { getParsedUser } from "@utils/auth";
import React from "react";

export default function CurationPage({ user }) {
  return (
    <Box className="container mt" pb={6}>
      <Curation user={user} />
    </Box>
  );
}

CurationPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx);
  const user = getParsedUser(ctx);

  return { user };
};
