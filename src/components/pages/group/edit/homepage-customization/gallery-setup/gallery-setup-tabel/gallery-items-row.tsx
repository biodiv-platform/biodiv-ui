import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  LinkIcon
} from "@chakra-ui/icons";
import { Box, Button, Image, Link } from "@chakra-ui/react";
import useGlobalState from "@hooks/use-global-state";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { SortableElement } from "react-sortable-hoc";

const GalleryItemsRow: any = SortableElement(({ itemDetails, onDelete, onEdit }) => {
  const { t } = useTranslation();
  const { title, customDescripition, moreLinks, fileName, observationId, truncated } = itemDetails;
  const { currentGroup } = useGlobalState();
  const imgUrl = observationId
    ? getResourceThumbnail(RESOURCE_CTX.OBSERVATION, fileName, RESOURCE_SIZE.LIST_THUMBNAIL)
    : getResourceThumbnail(RESOURCE_CTX.USERGROUPS, fileName, RESOURCE_SIZE.LIST_THUMBNAIL);

  return (
    <tr>
      <Box as="td" w="16rem">
        <DragHandleIcon cursor="move" /> {title}
      </Box>
      <td>
        <Image src={imgUrl} />
      </td>
      <td>{customDescripition}</td>

      {currentGroup.id ? (
        <td>
          <Link target="_blank" href={moreLinks}>
            <LinkIcon />
          </Link>
        </td>
      ) : (
        <td>
          {truncated ? <CheckIcon color={"blue"} ml={2} /> : <CloseIcon color={"red"} ml={2} />}
        </td>
      )}
      <td>
        <Button
          onClick={onDelete}
          variant="link"
          colorPalette="red"
          leftIcon={<DeleteIcon />}
          ml={2}
        >
          {t("common:delete")}
        </Button>
      </td>
      <td>
        <Button onClick={onEdit} variant="link" colorPalette="blue" leftIcon={<EditIcon />} ml={2}>
          {t("common:edit")}
        </Button>
      </td>
    </tr>
  );
});

export default GalleryItemsRow;
