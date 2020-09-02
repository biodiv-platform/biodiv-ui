import React, { useMemo } from "react";

import CheckboxFilter from "../../shared/checkbox/checkboxs";

export default function UserGroupFilter({ field: { id, values } }) {
  const groupOptions = useMemo(
    () => values.map((g) => ({ label: g.value, value: g.value, stat: g.value })),
    []
  );

  return values?.length <= 0 ? null : (
    <CheckboxFilter
      filterKey={`custom_${id}.field_text`}
      options={groupOptions}
      showSearch={true}
      skipOptionsTranslation={true}
    />
  );
}
