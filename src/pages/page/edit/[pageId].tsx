import PageEditPageComponent from "@components/pages/page/edit";
import { axGetPageByID } from "@services/pages.service";
import React from "react";

import Error from "../../_error";

export default function PageEditPage({ success, data }) {
  return success ? <PageEditPageComponent page={data} /> : <Error statusCode={404} />;
}

export const getServerSideProps = async (ctx) => {
  const props = await axGetPageByID(ctx.query.pageId, "full");
  return { props };
};
