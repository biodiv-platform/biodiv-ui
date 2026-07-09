import { DndItemWrapper, DndListWrapper } from "@/components/pages/common/reusable-dnd";

import { CustomFieldRow } from "./custom-field-row";

export default function CustomFieldListItems({
  customFieldList,
  removeCustomField,
  customFieldDetails,
  onSortEnd
}) {
  return (
    <DndListWrapper
      items={customFieldList}
      getItemId={(item) => item.customFields.id}
      onSortEnd={onSortEnd}
    >
      <tbody>
        {customFieldList.map((item, index) => (
          <DndItemWrapper key={item.customFields.id} id={item.customFields.id}>
            {({ setNodeRef, style, dragHandleProps }) => (
              <CustomFieldRow
                innerRef={setNodeRef}
                style={style}
                dragHandleProps={dragHandleProps}
                onDelete={() =>
                  removeCustomField(item.customFields.authorId ? item.customFields.id : index)
                }
                onEdit={() => customFieldDetails(item.customFields.id)}
                itemDetails={item}
              />
            )}
          </DndItemWrapper>
        ))}
      </tbody>
    </DndListWrapper>
  );
}
