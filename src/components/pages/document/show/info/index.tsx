import { Box, Icon, SimpleGrid } from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import { ResponsiveInfo } from "@components/pages/observation/show/info/responsive-info";
import TagsShow from "@components/pages/observation/show/info/tags";
import { ShowDocument } from "@interfaces/document";
import { axUpdateObservationTags } from "@services/observation.service";
import { LICENSES } from "@static/licenses";
import { getInjectableHTML } from "@utils/text";
import React from "react";

interface DocumentInfoProps {
  d: ShowDocument;
}

export default function DocumentInfo({ d }: DocumentInfoProps) {
  const {
    title,
    externalUrl,
    type,
    notes,
    attribution,
    contributors,
    version,
    doil,
    fromDate,
    languageId,
    licenseId,
    id: documentId
  } = d.document;

  const INFO_LINKS = [
    {
      title: "DOCUMENT.TITLE",
      value: title
    },
    {
      title: "DOCUMENT.URL",
      value: externalUrl,
      cell: (
        <BlueLink href={externalUrl} target="_blank" rel="noreferrer noopener">
          {externalUrl} <Icon name="external-link" />
        </BlueLink>
      )
    },
    {
      title: "DOCUMENT.TYPE",
      value: type
    },
    {
      title: "DOCUMENT.ABSTRACT",
      value: notes,
      cell: (
        <Box
          gridColumn="2/5"
          className="sanitized-html"
          dangerouslySetInnerHTML={{
            __html: getInjectableHTML(notes)
          }}
        ></Box>
      )
    },
    {
      title: "DOCUMENT.ATTRIBUTION",
      value: attribution
    },
    {
      title: "DOCUMENT.AUTHORS",
      value: contributors
    },
    {
      title: "DOCUMENT.VERSION",
      value: version
    },
    {
      title: "DOCUMENT.DOI",
      value: doil
    },
    {
      title: "DOCUMENT.PUBLICATION_DATE",
      value: fromDate
    },
    {
      title: "DOCUMENT.PUBLICATION_LANGUAGE",
      value: languageId
    },
    {
      title: "DOCUMENT.LICENSE",
      value: licenseId,
      cell: (
        <BlueLink href={LICENSES[licenseId].link} target="_blank" rel="noreferrer noopener">
          {LICENSES[licenseId].name} <Icon name="external-link" />
        </BlueLink>
      )
    },
    {
      title: "DOCUMENT.TAGS",
      value: 1,
      // TODO: replace with actual update func from back-end
      cell: <TagsShow items={d.tags} objectId={documentId} updateFunc={axUpdateObservationTags} />
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
