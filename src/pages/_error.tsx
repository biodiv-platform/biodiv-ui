import ErrorPage from "@components/pages/_error";
import React from "react";

function ErrorInt({ statusCode }) {
  return <ErrorPage statusCode={statusCode} />;
}

ErrorInt.getServerSideProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorInt;
