import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Select,
  SimpleGrid,
  Text
} from "@chakra-ui/react";
import { MY_UPLOADS_SORT } from "@components/pages/observation/create/form/options";
import { getImageThumb } from "@components/pages/observation/create/form/uploader/observation-resources/resource-card";
import StatusIcon from "@components/pages/observation/create/form/uploader/statusicon";
import useGlobalState from "@hooks/use-global-state";
import DeleteIcon from "@icons/delete";
import { getFallbackByMIME } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import useObservationCreate2 from "../../use-observation-create2-hook";
import UploadIcon from "../upload-icon";

const DraftResource = ({ resource: r }) => {
  const { media, draft } = useObservationCreate2();
  const { user } = useGlobalState();

  const [isSelected, isDisabled] = useMemo(
    () => [media.keys.includes(r.hashKey), media.disabledKeys.includes(r.hashKey)],
    [media, r.hashKey, media.disabledKeys]
  );

  const handleOnResourceToggle = () => {
    if (isDisabled) return;
    media.toggleSelection(r.hashKey, !isSelected);
  };

  const handleOnResourceDelete = (e) => {
    e.stopPropagation();
    draft.remove(r);
  };

  return (
    <Box
      border="2px"
      borderColor={isSelected || isDisabled ? "blue.500" : "gray.300"}
      borderRadius="md"
      borderStyle={isDisabled ? "dashed" : "solid"}
      key={r.hashKey}
      onClick={handleOnResourceToggle}
      p={2}
      position="relative"
    >
      <AspectRatio ratio={1}>
        <Image
          alt={r.hashKey}
          borderRadius="0.4rem"
          objectFit="cover"
          src={getImageThumb(r, user?.id)}
          fallbackSrc={getFallbackByMIME(r.type)}
        />
      </AspectRatio>
      <Box position="absolute" bottom={0} left={0} m={4}>
        <StatusIcon type={r.status} />
      </Box>
      <IconButton
        aria-label="Delete Resource"
        colorScheme="red"
        hidden={isDisabled}
        icon={<DeleteIcon />}
        m={4}
        onClick={handleOnResourceDelete}
        position="absolute"
        right={0}
        size="sm"
        top={0}
      />
    </Box>
  );
};

export default function DraftMedia({ onBrowse }) {
  const { draft } = useObservationCreate2();
  const { t } = useTranslation();

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Text>💡 {t("form:description.my_uploads")}</Text>
        <Select value={draft.sortBy} onChange={(e) => draft.setSortBy(e.target.value)} maxW="10rem">
          {MY_UPLOADS_SORT.map((o) => (
            <option key={o.value} value={o.value}>
              {t(`form:my_uploads_sort.${o.label}`)}
            </option>
          ))}
        </Select>
      </Flex>
      <Box>
        {draft.all.length ? (
          <SimpleGrid columns={{ base: 3, sm: 5, md: 6 }} spacing={4}>
            {draft.all.map((r) => (
              <DraftResource key={r.hashKey} resource={r} />
            ))}
          </SimpleGrid>
        ) : (
          <Flex
            alignItems="center"
            bg="gray.50"
            border="2px dashed var(--chakra-colors-gray-300)"
            borderRadius="md"
            flexDirection="column"
            justifyContent="center"
            minH="320px"
          >
            <UploadIcon size={80} />
            <Heading size="md" fontWeight="normal" mt={4} color="gray.400">
              {t("observation:drag_drop_files")}
            </Heading>
            <Text my={4} color="gray.400">
              {t("common:or")}
            </Text>
            <Button colorScheme="blue" onClick={onBrowse}>
              {t("form:uploader.browse")}
            </Button>
          </Flex>
        )}
      </Box>
    </>
  );
}
