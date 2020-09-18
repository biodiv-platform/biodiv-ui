import { Box, IconButton, useDisclosure } from "@chakra-ui/core";
import EditIcon from "@icons/edit";
import { Tags } from "@interfaces/observation";
import React, { useState } from "react";

import LinkTag from "../../common/link-tag";
import TagsEditor from "./tags-editor";

interface ITagsShowProps {
  items: Tags[];
  objectId;
  updateFunc;
  queryFunc;
}

export default function TagsShow({ items = [], objectId, updateFunc, queryFunc }: ITagsShowProps) {
  const [tags, setTags] = useState(items.map((i) => ({ label: i.name, value: i.id })));
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Box gridColumn="2/5" mb={2}>
      {isOpen ? (
        <TagsEditor
          objectId={objectId}
          tags={tags}
          setTags={setTags}
          onClose={onClose}
          queryFunc={queryFunc}
          updateFunc={updateFunc}
        />
      ) : (
        <Box>
          {tags?.map((tag) => (
            <LinkTag label={tag.label} key={tag?.label} />
          ))}
          <IconButton
            variant="link"
            colorScheme="blue"
            onClick={onToggle}
            aria-label="Edit"
            icon={<EditIcon />}
          />
        </Box>
      )}
    </Box>
  );
}
