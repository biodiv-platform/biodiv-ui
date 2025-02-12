import { Box, ListItem } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { Reference } from "@interfaces/species";
import React from "react";

// Define types for the text parts
interface TextPart {
  type: "text" | "url";
  content: string;
  href?: string;
}

// Utility function to detect and split text containing URLs

const parseTextWithUrls = (text: string | null): TextPart[] => {
  // Return empty array if text is null
  if (!text) return [];
  // Matches URLs that start with http://, https://, or www.
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts: TextPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index)
      });
    }

    // Add the URL
    let url = match[0];
    if (url.startsWith("www.")) {
      url = "http://" + url;
    }

    parts.push({
      type: "url",
      content: match[0],
      href: url
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last URL
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex)
    });
  }

  return parts;
};

interface AutoLinkTextProps {
  text: string;
}

const AutoLinkText: React.FC<AutoLinkTextProps> = ({ text }) => {
  const parts = parseTextWithUrls(text);

  return (
    <>
      {parts.map((part, index) =>
        part.type === "url" && part.href ? (
          <ExternalBlueLink key={index} href={part.href} />
        ) : (
          <span key={index}>{part.content}</span>
        )
      )}
    </>
  );
};

interface ReferenceListItemProps {
  reference: Reference;
  permissions: {
    isContributor: boolean;
  };
  children?: React.ReactNode;
}

// Modified ListItem component for references
const ReferenceListItem: React.FC<ReferenceListItemProps> = ({
  reference,
  permissions,
  children
}) => (
  <ListItem mb={2}>
    <Box display="flex" flexWrap="wrap" alignItems="flex-end" pl={1}>
      <Box flex="1" minWidth="0">
        <AutoLinkText text={reference.title} />{" "}
        {reference.url && <ExternalBlueLink href={reference.url} />}
      </Box>
      {permissions.isContributor && children}
    </Box>
  </ListItem>
);

export { AutoLinkText, ReferenceListItem };
