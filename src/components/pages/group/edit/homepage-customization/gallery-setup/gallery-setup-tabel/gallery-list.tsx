import { DndItemWrapper,DndListWrapper } from "@/components/pages/common/reusable-dnd";

import { GalleryItemsRow } from "./gallery-items-row";

export default function GalleryListItems({ galleryList, removeGalleryItem, editGalleryItem, onSortEnd }) {
  return (
    <DndListWrapper items={galleryList} getItemId={(item) => item.sliderId} onSortEnd={onSortEnd}>
      <tbody>
        {galleryList.map((item, index) => (
          <DndItemWrapper key={item.sliderId} id={item.sliderId}>
            {({ setNodeRef, style, dragHandleProps }) => (
              <GalleryItemsRow
                innerRef={setNodeRef}
                style={style}
                dragHandleProps={dragHandleProps}
                onDelete={() => removeGalleryItem(index)}
                onEdit={() => editGalleryItem(index)}
                itemDetails={item}
              />
            )}
          </DndItemWrapper>
        ))}
      </tbody>
    </DndListWrapper>
  );
}