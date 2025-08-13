import { LANG } from "@configs/site-config";
import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import GalleryItemRow from "./gallery-items-row";

const GalleryListItems: any = SortableContainer(
  ({ galleryList, removeGalleryItem, editGalleryItem, languageId }) => (
    <tbody>
      {galleryList.map(([sliderKey, languageMap], index) => (
        <GalleryItemRow
          key={sliderKey}
          index={index}
          onDelete={() => removeGalleryItem(index)}
          onEdit={() => editGalleryItem(index)}
          itemDetails={languageMap?.[languageId]?.[0]||languageMap?.[LANG.DEFAULT_ID]?.[0]}
        />
      ))}
    </tbody>
  )
);

export default GalleryListItems;
