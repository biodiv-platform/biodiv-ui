import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import CustomFieldRow from "./custom-field-row";

const CustomFieldListItems = SortableContainer(({ customFieldList, removeCustomField }) => (
  <tbody>
    {customFieldList.map((item, index) => (
      <CustomFieldRow
        key={item.customFields.id}
        index={index}
        onDelete={() => removeCustomField(item.customFields.id)}
        itemDetails={item}
      />
    ))}
  </tbody>
));

export default CustomFieldListItems;
