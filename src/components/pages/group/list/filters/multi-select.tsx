import React, { useEffect, useState } from "react";

import CheckBoxItems from "../../common/icon-checkbox-field/checkbox";
import useGroupListFilter from "../use-group-list";

export default function MultiSelect({ options, initialValue, name, type }) {
  const [value, setValue] = useState(initialValue || []);
  const { addFilter } = useGroupListFilter();

  useEffect(() => {
    addFilter(name, value);
  }, [value]);

  return <CheckBoxItems options={options} defaultValue={value} onChange={setValue} type={type} />;
}
