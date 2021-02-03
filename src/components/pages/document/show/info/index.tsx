import { Box, SimpleGrid } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import HTMLContainer from "@components/@core/html-container";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import TagsShow from "@components/pages/observation/show/info/tags";
import { ShowDocument } from "@interfaces/document";
import { axQueryDocumentTagsByText, axUpdateDocumentTags } from "@services/document.service";
import { LICENSES } from "@static/licenses";
import { formatDateReadableFromUTC } from "@utils/date";
import { getInjectableHTML } from "@utils/text";
import React from "react";

interface DocumentInfoProps {
  d: ShowDocument;
}

export default function DocumentInfo({ d }: DocumentInfoProps) {
  const { document } = d;

  const INFO_LINKS = [
    {
      title: "DOCUMENT.TYPE",
      value: document?.itemtype
    },
    {
      title: "DOCUMENT.TITLE",
      value: document?.title
    },
    {
      title: "DOCUMENT.BIB.AUTHOR",
      value: document?.author
    },
    {
      title: "DOCUMENT.DESCRIPTION",
      value: document?.notes,
      cell: (
        <Box
          as={HTMLContainer}
          gridColumn="2/5"
          dangerouslySetInnerHTML={{
            __html: getInjectableHTML(document?.notes)
          }}
        ></Box>
      )
    },
    {
      title: "DOCUMENT.BIB.JOURNAL",
      value: document?.journal
    },
    {
      title: "DOCUMENT.BIB.BOOKTITLE",
      value: document?.bookTitle
    },
    {
      title: "DOCUMENT.BIB.SERIES",
      value: document?.series
    },
    {
      title: "DOCUMENT.BIB.VOLUME",
      value: document?.volume
    },
    {
      title: "DOCUMENT.BIB.NUMBER",
      value: document?.number
    },
    {
      title: "DOCUMENT.BIB.PAGES",
      value: document?.pages
    },
    {
      title: "DOCUMENT.BIB.PUBLISHER",
      value: document?.publisher
    },
    {
      title: "DOCUMENT.PUBLICATION_DATE",
      value: document?.fromDate,
      cell: formatDateReadableFromUTC(document?.fromDate)
    },
    {
      title: "DOCUMENT.PUBLICATION_LANGUAGE",
      value: document?.language
    },
    {
      title: "DOCUMENT.BIB.YEAR",
      value: document?.year
    },
    {
      title: "DOCUMENT.BIB.MONTH",
      value: document?.month
    },
    {
      title: "DOCUMENT.CREATED_ON",
      value: document?.createdOn,
      cell: formatDateReadableFromUTC(document?.createdOn)
    },
    {
      title: "DOCUMENT.BIB.DOI",
      value: document?.doil
    },
    {
      title: "DOCUMENT.CONTRIBUTION",
      value: document?.contributors
    },
    {
      title: "DOCUMENT.LICENSE",
      value: document?.licenseId,
      cell: document?.licenseId && (
        <ExternalBlueLink href={LICENSES[document.licenseId].link}>
          {LICENSES[document.licenseId].name}
        </ExternalBlueLink>
      )
    },
    {
      title: "DOCUMENT.TAGS",
      value: 1,
      cell: (
        <TagsShow
          items={d.tags}
          objectId={document?.id}
          href={"/document/list"}
          queryFunc={axQueryDocumentTagsByText}
          updateFunc={axUpdateDocumentTags}
        />
      )
    }
  ];

  return (
    <Box p={4} mb={4} className="white-box">
      <SimpleGrid columns={[1, 1, 5, 5]} spacing={2}>
        {INFO_LINKS.map(({ title, value, cell }) =>
          value ? (
            <ResponsiveInfo key={title} title={title}>
              {cell || value}
            </ResponsiveInfo>
          ) : null
        )}
      </SimpleGrid>
    </Box>
  );
}
