import { Box, Button, Flex, Image, Link } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import useGlobalState from "@hooks/use-global-state";
import { RESOURCE_SIZE } from "@static/constants";
import { getResourceThumbnail, RESOURCE_CTX } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import { LuCheck, LuDelete, LuGripVertical, LuLink, LuPencil, LuX } from "react-icons/lu";

export function GalleryItemsRow({
  itemDetails,
  onDelete,
  onEdit,
  dragHandleProps,
  innerRef,
  style
}) {
  const { t } = useTranslation();
  const { moreLinks, fileName, observationId, truncated } = itemDetails;
  const translations = Object.fromEntries(
    itemDetails.translations.map((item) => [Number(item.languageId), item])
  );
  const { currentGroup, languageId } = useGlobalState();
  const imgUrl = observationId
    ? getResourceThumbnail(RESOURCE_CTX.OBSERVATION, fileName, RESOURCE_SIZE.LIST_THUMBNAIL)
    : getResourceThumbnail(RESOURCE_CTX.USERGROUPS, fileName, RESOURCE_SIZE.LIST_THUMBNAIL);

  return (
    <tr ref={innerRef} style={style}>
      <Box as="td" w="16rem">
        <Flex align="center">
          <Box as="span" cursor="grab" mr="0.5rem" display="inline-flex" {...dragHandleProps}>
            <LuGripVertical />
          </Box>
          {translations?.[languageId]?.title || translations?.[SITE_CONFIG.LANG.DEFAULT_ID]?.title}
        </Flex>
      </Box>
      <td>
        <Image src={imgUrl} />
      </td>
      <td>
        {translations?.[languageId]?.description ||
          translations?.[SITE_CONFIG.LANG.DEFAULT_ID]?.description}
      </td>

      {currentGroup.id ? (
        <td>
          <Link target="_blank" href={moreLinks}>
            <LuLink />
          </Link>
        </td>
      ) : (
        <td>{truncated ? <LuCheck color={"blue"} /> : <LuX color={"red"} />}</td>
      )}
      <td>
        <Button onClick={onDelete} colorPalette="red" ml={2}>
          <LuDelete />
          {t("common:delete")}
        </Button>
      </td>
      {itemDetails.id && (
        <td>
          <Button onClick={onEdit} colorPalette="blue" ml={2}>
            <LuPencil />
            {t("common:edit")}
          </Button>
        </td>
      )}
    </tr>
  );
}
