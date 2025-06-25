import React, { useMemo } from "react";

import CheckboxFilter from "../../shared/checkbox/checkboxs";
import { CUSTOM_FILTER_KEYS } from "./filter-keys";

export default function CatergoricalFilter({ field: { id, values, name, fieldtype } }) {
  const groupOptions = useMemo(
    () => [
      ...CUSTOM_FILTER_KEYS,
      ...values.map((g) => ({ label: g.value, value: g.value, stat: g.value }))
    ],
    []
  );

  return values?.length <= 0 ? null : (
    <CheckboxFilter
      filterKey={`custom_${id}.field_text`}
      options={groupOptions}
      showSearch={true}
      statKey={`groupCustomField.${name}|${id}|${fieldtype}`}
      skipOptionsTranslation={true}
    />
  );
}
