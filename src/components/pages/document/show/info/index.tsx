import { Box, SimpleGrid } from "@chakra-ui/react";
import ExternalBlueLink from "@components/@core/blue-link/external";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import TagsShow from "@components/pages/observation/show/info/tags";
import { ShowDocument } from "@interfaces/document";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { axQueryDocumentTagsByText, axUpdateDocumentTags } from "@services/document.service";
import { formatDateReadableFromUTC } from "@utils/date";
import { getInjectableHTML } from "@utils/text";
import React from "react";

interface DocumentInfoProps {
  d: ShowDocument;
}

export default function DocumentInfo({ d }: DocumentInfoProps) {
  const { document, documentLicense } = d;

  const INFO_LINKS = [
    {
      title: "document:type",
      value: document?.itemtype
    },
    {
      title: "form:title",
      isHtml: true,
      value: document?.title
    },
    {
      title: "document:bib.author",
      value: document?.author
    },
    {
      title: "document:description",
      value: document?.notes,
      cell: (
        <Prose>
          <Box
            gridColumn="2/5"
            dangerouslySetInnerHTML={{
              __html: getInjectableHTML(document?.notes)
            }}
          />
        </Prose>
      )
    },
    {
      title: "document:bib.journal",
      isHtml: true,
      value: document?.journal
    },
    {
      title: "document:bib.booktitle",
      isHtml: true,
      value: document?.bookTitle
    },
    {
      title: "document:bib.series",
      value: document?.series
    },
    {
      title: "document:bib.volume",
      value: document?.volume
    },
    {
      title: "document:bib.number",
      value: document?.number
    },
    {
      title: "document:bib.pages",
      value: document?.pages
    },
    {
      title: "document:bib.publisher",
      value: document?.publisher
    },
    {
      title: "document:publication_date",
      value: document?.fromDate,
      cell: formatDateReadableFromUTC(document?.fromDate)
    },
    {
      title: "document:publication_language",
      value: document?.language
    },
    {
      title: "document:bib.year",
      value: document?.year
    },
    {
      title: "document:bib.month",
      value: document?.month
    },
    {
      title: "document:created_on",
      value: document?.createdOn,
      cell: formatDateReadableFromUTC(document?.createdOn)
    },
    {
      title: "document:bib.doi",
      value: document?.doi
    },
    {
      title: "document:contribution",
      isHtml: true,
      value: document?.contributors
    },
    {
      title: "form:license",
      value: document?.licenseId,
      cell: documentLicense && (
        <ExternalBlueLink href={documentLicense.url}>{documentLicense.name}</ExternalBlueLink>
      )
    },
    {
      title: "document:tags.title",
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
        {INFO_LINKS.map(({ title, value, isHtml, cell }) =>
          value ? (
            <ResponsiveInfo key={title} title={title} isHtml={isHtml} children={cell || value} />
          ) : null
        )}
      </SimpleGrid>
    </Box>
  );
}
