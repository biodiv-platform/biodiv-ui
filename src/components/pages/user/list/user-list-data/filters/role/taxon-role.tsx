import useUserFilter from "@components/pages/user/common/use-user-filter";
import { covertToSentenceCase } from "@utils/text";
import React from "react";

import CheckboxFilterPanel from "../shared/checkbox";

export default function TaxonRoleFilter() {
  const {
    userListData: {
      ag: { taxonomyRole }
    }
  } = useUserFilter();

  const OPTIONS = Object.keys(taxonomyRole)?.map((val) => ({
    label: covertToSentenceCase(val),
    value: val,
    stat: taxonomyRole[val]
  }));

  return (
    <CheckboxFilterPanel
      translateKey="filters:user.taxon_role_"
      filterKey="taxonRole"
      options={OPTIONS}
      statKey="taxonomyRole"
      skipOptionsTranslation={true}
      showSearch={false}
    />
  );
}
