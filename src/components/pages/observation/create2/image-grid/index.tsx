import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import UploadIcon from "../media-picker/upload-icon";
import ImageGridContainer from "./container";
import ObservationBox from "./observation";

const ImageGrid = ({ fields, onRemove, onBrowse }) => {
  const { t } = useTranslation();

  return fields.length ? (
    <ImageGridContainer>
      {fields.map((field, index) => (
        <ObservationBox key={field.id} remove={onRemove} index={index} />
      ))}
    </ImageGridContainer>
  ) : (
    <Flex minH="calc(90vh - var(--heading-height))" alignItems="center" justifyContent="center">
      <Flex flexDir="column" alignItems="center" p={4}>
        <UploadIcon size={100} />
        <Heading size="lg" fontWeight="normal" color="gray.400" mt={8}>
          {t("observation:drag_drop_files")}
        </Heading>

        <Text my={8} fontSize="lg" color="gray.400">{t("common:or")}</Text>

        <Button colorScheme="blue" onClick={onBrowse}>{t("form:uploader.browse")}</Button>
      </Flex>
    </Flex>
  );
};

export default ImageGrid;
