import ErrorPage from "@components/pages/_error";

function ErrorInt({ statusCode }) {
  return <ErrorPage statusCode={statusCode} />;
}

export default ErrorInt;
