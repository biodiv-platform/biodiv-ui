import { Box, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import BoxHeading from "@components/@core/layout/box-heading";
import LinkTag from "@components/pages/observation/common/link-tag";
import TagsEditor from "@components/pages/observation/show/info/tags-editor";
import useGlobalState from "@hooks/use-global-state";
import EditIcon from "@icons/edit";
import { Tags } from "@interfaces/observation";
import { axQueryDocumentTagsByText, axUpdateDocumentTags } from "@services/document.service";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

interface ITagsTabsProps {
  tags: Tags[];
  documentId;
}
export default function TagsTab({ documentId, tags }: ITagsTabsProps) {
  const { t } = useTranslation();
  const { isLoggedIn } = useGlobalState();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [tagsItems, setTags] = useState<any | undefined>(
    tags[0] ? tags?.map((i) => ({ label: i.name, value: i?.id })) : null
  );

  return (
    <>
      <BoxHeading>
        🔔 {t("document:tags.title")}
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
              <LinkTag
                href={"/document/list"}
                hardLink={true}
                label={item?.label}
                key={item?.label}
              />
            ))}
          </Box>
        ) : (
          <Text mb={2} color="gray.600">
            {t("document:tags.not_found")}
          </Text>
        )}
      </Box>
    </>
  );
}
