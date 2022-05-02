import { authorizedPageSSR } from "@components/auth/auth-redirect";
import TextCurationCreateComponent from "@components/pages/text-curation/create";
import { Role } from "@interfaces/custom";
import React from "react";

export default function TextCurationCreatePage() {
  return <TextCurationCreateComponent />;
}

TextCurationCreatePage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx);

  return {};
};
