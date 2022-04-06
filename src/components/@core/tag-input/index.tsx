import { Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

import Tag from "./tag";

interface TagsInputProps {
  name?: string;
  placeHolder?: string;
  onChange?: (tags: string) => void;
  onBlur?: any;
}

const TagInput = styled.input`
  border: 0;
  outline: 0;
  font-size: inherit;
  line-height: inherit;
  width: 50%;
`;

export const TagsInput = ({ name, placeHolder, onChange, onBlur }: TagsInputProps) => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    onChange && onChange(tags.toString());
  }, [tags]);

  const handleOnKeyUp = (e) => {
    e.stopPropagation();
    const text = e.target.value;

    if (e.key === "Backspace" && tags.length && !text) {
      setTags(tags.slice(0, -1));
    }

    if (text && e.key === "Enter" && !tags.includes(text)) {
      setTags([...tags, text]);
      e.target.value = "";
    }

    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const onTagRemove = (text) => {
    setTags(tags.filter((tag) => tag !== text));
  };

  return (
    <Flex
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
      flexWrap="wrap"
      lineHeight={1.4}
      p={2}
      aria-labelledby={name}
      style={{ gap: "0.5rem" }}
      bg="white"
      _focusWithin={{
        borderColor: "blue.500",
        boxShadow: "0 0 0 1px #3182ce"
      }}
    >
      {tags.map((tag) => (
        <Tag key={tag} text={tag} remove={onTagRemove} />
      ))}

      <TagInput
        type="text"
        name={name}
        placeholder={placeHolder}
        onKeyDown={handleOnKeyUp}
        onBlur={onBlur}
      />
    </Flex>
  );
};
