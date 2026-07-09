import { authorizedPageSSP } from "@components/auth/auth-redirect";
import NameMatchingComponent from "@components/pages/taxonomy/name-matching";
import { Role } from "@interfaces/custom";

const NameMatching = () => <NameMatchingComponent />;

export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Any], ctx);
  return redirect || { props: {} };
};

export default NameMatching;
