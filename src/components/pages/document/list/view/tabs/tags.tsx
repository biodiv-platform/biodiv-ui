import { Box, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import LinkTag from "@components/pages/observation/common/link-tag";
import TagsEditor from "@components/pages/observation/show/info/tags-editor";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import EditIcon from "@icons/edit";
import { Tags } from "@interfaces/observation";
import { axQueryDocumentTagsByText, axUpdateDocumentTags } from "@services/document.service";
import React, { useState } from "react";

interface ITagsTabsProps {
  tags: Tags[];
  tabIndex;
  tabLength;
  documentId;
}
export default function TagsTab({ tabIndex, documentId, tags, tabLength }: ITagsTabsProps) {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalState();
  const [tagsItems, setTags] = useState<any | undefined>(
    tags[0] ? tags?.map((i) => ({ label: i.name, value: i?.id })) : null
  );

  const { isOpen, onToggle, onClose } = useDisclosure();
  return tabIndex === tabLength ? (
    <>
      <BoxHeading>
        🔔 {t("DOCUMENT.TAGS.TITLE")}
        {isLoggedIn && (
          <IconButton
            ml={3}
            variant="link"
            colorScheme="blue"
            onClick={onToggle}
            aria-label="Edit"
            icon={<EditIcon />}
          />
        )}
      </BoxHeading>
      <Box gridColumn="2/5" m={3}>
        {isOpen ? (
          <TagsEditor
            objectId={documentId}
            tags={tagsItems}
            setTags={setTags}
            onClose={onClose}
            queryFunc={axQueryDocumentTagsByText}
            updateFunc={axUpdateDocumentTags}
          />
        ) : tagsItems?.length > 0 ? (
          <Box>
            {tagsItems?.map((item) => (
              <LinkTag href={"/document/list"} label={item?.label} key={item?.label} />
            ))}
          </Box>
        ) : (
          <Text mb={2} color="gray.600">
            {t("DOCUMENT.TAGS.NOT_FOUND")}
          </Text>
        )}
      </Box>
    </>
  ) : null;
}
