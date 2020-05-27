import { Box, IconButton, useDisclosure } from "@chakra-ui/core";
import { Tags } from "@interfaces/observation";
import React, { useState } from "react";

import LinkTag from "../../common/link-tag";
import TagsEditor from "./tags-editor";

interface ITagsShowProps {
  items: Tags[];
  observationId;
}

export default function TagsShow({ items = [], observationId }: ITagsShowProps) {
  const [tags, setTags] = useState(items.map((i) => ({ label: i.name, value: i.id })));
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box gridColumn="2/5" mb={2}>
      {isOpen ? (
        <TagsEditor observationId={observationId} tags={tags} setTags={setTags} onClose={onClose} />
      ) : (
        <Box>
          {tags.map((tag) => (
            <LinkTag label={tag.label} />
          ))}
          <IconButton
            variant="link"
            variantColor="blue"
            onClick={onToggle}
            aria-label="Edit"
            icon="edit"
          />
        </Box>
      )}
    </Box>
  );
}
