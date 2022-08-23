import PageShowPageComponent from "@components/pages/page/show";
import { axGetPageByID } from "@services/pages.service";
import React from "react";

export default function PageShowPage({ data }) {
  return <PageShowPageComponent page={data} />;
}

export const getServerSideProps = async (ctx) => {
  const props = await axGetPageByID(ctx.query.pageId);

  if (!props.success) return { notFound: true };

  if (props.data.url) {
    return {
      redirect: {
        permanant: false,
        destination: props.data.url
      },
      props: {}
    };
  }

  return { props };
};
