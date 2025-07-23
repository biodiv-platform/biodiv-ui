import { Flex, IconButton } from "@chakra-ui/react";
import DeleteActionButton from "@components/@core/action-buttons/delete";
import { PageHeading } from "@components/@core/layout";
import LocalLink from "@components/@core/local-link";
import Tooltip from "@components/@core/tooltip";
import { axDeleteObservationByDatatableId } from "@services/observation.service";
import { adminOrAuthor } from "@utils/auth";
import { formatDateReadableFromUTC } from "@utils/date";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { LuExternalLink } from "react-icons/lu";

import NoSSR from "@/components/@core/no-ssr";

export default function Header({ datatable, authorName }) {
  const { t } = useTranslation();

  const pageTitle = `${datatable?.title} by ${authorName} on ${formatDateReadableFromUTC(
    datatable?.createdOn
  )}`;

  const pageDescription = `${datatable?.title} Observed by ${authorName} at ${
    datatable?.geographicalCoveragePlaceName || "Unknown"
  } on ${formatDateReadableFromUTC(datatable?.createdOn)}`;

  const PageActions = () => (
    <NoSSR>
      <Flex direction={{ base: "row", sm: "row" }} gap={4} wrap="wrap" align="center">
        <Tooltip title={t("datatable:list.all")} positioning={{ placement: "bottom" }}>
          <LocalLink
            href="/observation/list"
            prefixGroup={true}
            params={{
              dataTableId: datatable?.id,
              mediaFilter: "no_of_images,no_of_videos,no_of_audio,no_media"
            }}
          >
            <IconButton
              aria-label="View all observations"
              variant="plain"
              colorPalette="blue"
              pl={{ base: 0, sm: 10 }}
            >
              <LuExternalLink />
            </IconButton>
          </LocalLink>
        </Tooltip>

        {adminOrAuthor(datatable.uploaderId) && (
          <DeleteActionButton
            observationId={datatable?.id}
            title={t("datatable:deleted_datatable")}
            description={t("observation:remove.description")}
            deleted={t("datatable:notifications.success_deleted")}
            deleteFunc={axDeleteObservationByDatatableId}
          />
        )}
      </Flex>
    </NoSSR>
  );

  return (
    <>
      <NextSeo
        openGraph={{
          title: pageTitle,
          images: [],
          description: pageDescription
        }}
        title={pageTitle}
      />

      <PageHeading actions={<PageActions />} className="fadeInUp">
        <i>{datatable?.title}</i>
      </PageHeading>
    </>
  );
}
