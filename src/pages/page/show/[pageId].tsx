import PageShowPageComponent from "@components/pages/page/show";
import { axGetPageByID } from "@services/pages.service";
import React from "react";

import Error from "../../_error";

export default function PageShowPage({ success, data }) {
  return success ? <PageShowPageComponent page={data} /> : <Error statusCode={404} />;
}

export const getServerSideProps = async (ctx) => {
  const props = await axGetPageByID(ctx.query.pageId);

  if (!props.success) return { notFound: true };

  return { props };
};
