import { Link, Tag } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import React from "react";

interface LinkTagProps {
  label;
  href?;
  hardLink?: boolean;
}

export default function LinkTag({ label, href = "/observation/list", hardLink }: LinkTagProps) {
  return (
    <LocalLink href={href} prefixGroup={true} params={{ tags: label }} hardLink={hardLink}>
      <Link>
        <Tag size="sm" key={label} colorScheme="blue" mb={2} mr={2}>
          {label}
        </Tag>
      </Link>
    </LocalLink>
  );
}
