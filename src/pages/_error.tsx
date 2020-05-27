import ErrorPage from "@components/pages/_error";
import React from "react";

function Error({ statusCode }) {
  return <ErrorPage statusCode={statusCode} />;
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
