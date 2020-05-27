import LoginComponent from "@components/pages/login";
import React from "react";

const LoginPage = ({ forward }) => <LoginComponent forward={forward} />;

LoginPage.getInitialProps = async (ctx) => ({
  forward: ctx.query.forward
});

export default LoginPage;
