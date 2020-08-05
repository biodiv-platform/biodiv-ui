import React from "react";
import GroupRulesRow from "./group-rules-row";

const CustomFieldListItems = ({ groupRules, removeCustomField }) => {
  return (
    <tbody>
      {groupRules.map((item, index) => (
        <GroupRulesRow
          key={index}
          onDelete={() => removeCustomField(item.customFields.id)}
          itemDetails={item}
        />
      ))}
    </tbody>
  );
};

export default CustomFieldListItems;
