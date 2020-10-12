import LoginComponent from "@components/pages/login";
import React from "react";

const LoginPage = ({ forward }) => <LoginComponent forward={forward} />;

export const getServerSideProps = async (ctx) => ({
  props: { forward: ctx?.query?.forward || null }
});

export default LoginPage;
