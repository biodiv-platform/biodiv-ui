import HomePageComponent from "@components/pages/home";
import React from "react";

export { getServerSideProps } from "../../index";

const GroupHomePage = ({ homeInfo }) => <HomePageComponent homeInfo={homeInfo} />;

export default GroupHomePage;
