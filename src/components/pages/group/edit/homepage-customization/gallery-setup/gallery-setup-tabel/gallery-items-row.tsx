import { DeleteIcon, DragHandleIcon, EditIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Button, Image, Link } from "@chakra-ui/react";
import { getGroupImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

const GalleryItemsRow: any = SortableElement(({ itemDetails, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { title, customDescripition, moreLinks, fileName } = itemDetails;

  const imgUrl = getGroupImage(fileName) + "/?h=300";

  return (
    <tr>
      <Box as="td" w="16rem">
        <DragHandleIcon cursor="move" /> {title}
      </Box>
      <td>
        <Image src={imgUrl} />
      </td>
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
          {t("common:delete")}
        </Button>
      </td>
      <td>
        <Button onClick={onEdit} variant="link" colorScheme="blue" leftIcon={<EditIcon />} ml={2}>
          {t("common:edit")}
        </Button>
      </td>
    </tr>
  );
});

export default GalleryItemsRow;
