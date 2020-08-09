import React from "react";
import GroupRulesRow from "./group-rules-row";

const GroupRulesListItems = ({ groupRules, removeGroupRules }) => {
  return (
    <tbody>
      {groupRules.map((item, index) => (
        <GroupRulesRow
          key={index}
          onDelete={() => removeGroupRules({ filterName: item.name, filterId: item.id })}
          itemDetails={item}
        />
      ))}
    </tbody>
  );
};

export default GroupRulesListItems;
