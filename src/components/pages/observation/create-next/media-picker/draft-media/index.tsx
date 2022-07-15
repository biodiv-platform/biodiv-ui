import {
  AspectRatio,
  Box,
  Button,
  Flex,
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
import CheckIcon from "@icons/check";
import DeleteIcon from "@icons/delete";
import { AssetStatus } from "@interfaces/custom";
import { getFallbackByMIME } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";

import useObservationCreateNext from "../../use-observation-create-next-hook";
import UploadIcon from "../upload-icon";

const DraftResource = ({ resource: r }) => {
  const { media, draft } = useObservationCreateNext();
  const { user } = useGlobalState();

  const [isSelected, isDisabled] = useMemo(
    () => [
      media.keys.includes(r.hashKey),
      media.disabledKeys.includes(r.hashKey) || r.status !== AssetStatus.Uploaded
    ],
    [media, r.hashKey, r.status, media.disabledKeys]
  );

  const handleOnResourceToggle = () => {
    if (isDisabled) return;
    media.toggleSelection(r.hashKey, !isSelected);
  };

  const handleOnResourceDelete = (e) => {
    e.stopPropagation();
    draft.remove(r);
  };

  const imgThumb = useMemo(
    () => ({
      key: r.id,
      src: getImageThumb(r, user?.id),
      fallbackSrc: getFallbackByMIME(r?.type)
    }),
    [r.id, r.status]
  );

  return (
    <Box
      border="2px"
      borderColor={isSelected || isDisabled ? "blue.500" : "gray.300"}
      borderRadius="md"
      borderStyle={isDisabled ? "dashed" : "solid"}
      className="fade"
      onClick={handleOnResourceToggle}
      p={2}
      position="relative"
    >
      <AspectRatio ratio={1}>
        <Image
          alt={r.hashKey}
          borderRadius="0.4rem"
          objectFit="cover"
          src={imgThumb.src}
          fallbackSrc={imgThumb.fallbackSrc}
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

export default function DraftMedia({ onBrowse, onImport }) {
  const { draft } = useObservationCreateNext();
  const { t } = useTranslation();

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDir={{ base: "column", md: "row" }}
      >
        <Text mb={4}>💡 {t("form:description.my_uploads")}</Text>
        <Flex mb={4}>
          <Button colorScheme="blue" leftIcon={<CheckIcon />} onClick={onImport} mr={4}>
            {t("common:import")}
          </Button>
          <Select
            value={draft.sortBy}
            onChange={(e) => draft.setSortBy(e.target.value)}
            maxW="9rem"
          >
            {MY_UPLOADS_SORT.map((o) => (
              <option key={o.value} value={o.value}>
                {t(`form:my_uploads_sort.${o.label}`)}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 2, sm: 5, md: 6 }} spacing={4}>
        <Box
          border="2px"
          borderColor="gray.300"
          borderRadius="md"
          borderStyle="dashed"
          onClick={onBrowse}
          p={2}
          cursor="pointer"
          position="relative"
        >
          <AspectRatio ratio={1}>
            <Flex flexDir="column">
              <UploadIcon size={56} />
            </Flex>
          </AspectRatio>
        </Box>

        {draft.all.map((r) => (
          <DraftResource key={r.hashKey} resource={r} />
        ))}
      </SimpleGrid>
    </>
  );
}
