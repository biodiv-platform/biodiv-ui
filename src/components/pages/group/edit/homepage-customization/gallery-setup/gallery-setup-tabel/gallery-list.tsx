import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import GalleryItemRow from "./gallery-items-row";

const GalleryListItems = SortableContainer(
  ({ galleryList, removeGalleryItem, editGalleryItem }) => (
    <tbody>
      {galleryList.map((item, index) => (
        <GalleryItemRow
          key={item.id}
          index={index}
          onDelete={() => removeGalleryItem(index)}
          onEdit={() => editGalleryItem(index)}
          itemDetails={item}
        />
      ))}
    </tbody>
  )
);

export default GalleryListItems;
