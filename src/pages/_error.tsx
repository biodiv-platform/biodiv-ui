import ErrorPage from "@components/pages/_error";
import React from "react";

function ErrorInt({ statusCode }) {
  return <ErrorPage statusCode={statusCode} />;
}

export default ErrorInt;
