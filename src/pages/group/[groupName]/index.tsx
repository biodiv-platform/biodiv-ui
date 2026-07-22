import HomePageComponent from "@components/pages/home";

export { getServerSideProps } from "../../index";

const GroupHomePage = ({ homeInfo }) => <HomePageComponent homeInfo={homeInfo} />;

export default GroupHomePage;
