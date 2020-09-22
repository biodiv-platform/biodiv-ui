import { Link, Tag } from "@chakra-ui/core";
import LocalLink from "@components/@core/local-link";
import React from "react";

export default function LinkTag({ label }) {
  return (
    <LocalLink href="/observation/list" prefixGroup={true} params={{ tags: label }}>
      <Link>
        <Tag size="sm" key={label} colorScheme="blue" mb={2} mr={2}>
          {label}
        </Tag>
      </Link>
    </LocalLink>
  );
}
