import ErrorPage from "@components/pages/_error";
import React from "react";

function ErrorInt({ statusCode }) {
  return <ErrorPage statusCode={statusCode || 404} />;
}

export default ErrorInt;
