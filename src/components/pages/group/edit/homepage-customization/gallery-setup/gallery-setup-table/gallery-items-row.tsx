import { Box, Button, Icon, Link } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

const GalleryItemsRow = SortableElement(({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const { title, customDescripition, moreLinks } = itemDetails;

  return (
    <tr>
      <Box as="td" w="16rem">
        <Icon name="drag-handle" cursor="move" /> {title}
      </Box>
      <td>{customDescripition}</td>
      <td>
        <Link target="_blank" href={moreLinks}>
          <Icon name="link" />
        </Link>
      </td>
      <td>
        <Button onClick={onDelete} variant="link" variantColor="red" leftIcon="delete" ml={2}>
          {t("DELETE")}
        </Button>
      </td>
    </tr>
  );
});

export default GalleryItemsRow;
