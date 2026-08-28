import { authorizedPageSSP } from "@/components/auth/auth-redirect";
import TaxonomyBatchUploadComponent from "@/components/pages/taxonomy/batch-upload";
import { Role } from "@/interfaces/custom";

const TaxonomyBatchUpload = () => <TaxonomyBatchUploadComponent />;
export const getServerSideProps = async (ctx) => {
  const redirect = authorizedPageSSP([Role.Admin], ctx);
  return redirect || { props: {} };
};
export default TaxonomyBatchUpload;
