import { authorizedPageSSR } from "@components/auth/auth-redirect";
import NameMatchingComponent from "@components/pages/taxonomy/name-matching";
import { Role } from "@interfaces/custom";

import { axGetTaxonRanks } from "@/services/taxonomy.service";

export default function NameMatching({ taxonRanksMeta }) {
  return <NameMatchingComponent ranks={taxonRanksMeta}/>;
}

NameMatching.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx, false);

  const { data } = await axGetTaxonRanks();

  return { taxonRanksMeta: data };
};
