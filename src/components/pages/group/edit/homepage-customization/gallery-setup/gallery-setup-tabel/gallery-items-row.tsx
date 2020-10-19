import { Box, Button, Link } from "@chakra-ui/core";
import useTranslation from "@hooks/use-translation";
import { DeleteIcon, LinkIcon, DragHandleIcon } from "@chakra-ui/icons";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

const GalleryItemsRow = SortableElement(({ itemDetails, onDelete }) => {
  const { t } = useTranslation();
  const { title, customDescripition, moreLinks } = itemDetails;

  return (
    <tr>
      <Box as="td" w="16rem">
        <DragHandleIcon cursor="move" /> {title}
      </Box>
      <td>{customDescripition}</td>
      <td>
        <Link target="_blank" href={moreLinks}>
          <LinkIcon />
        </Link>
      </td>
      <td>
        <Button
          onClick={onDelete}
          variant="link"
          colorScheme="red"
          leftIcon={<DeleteIcon />}
          ml={2}
        >
          {t("DELETE")}
        </Button>
      </td>
    </tr>
  );
});

export default GalleryItemsRow;
