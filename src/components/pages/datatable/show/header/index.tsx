import DeleteActionButton from "@components/@core/action-buttons/delete";
import { PageHeading } from "@components/@core/layout";
import { axDeleteObservationByDatatableId } from "@services/observation.service";
import { adminOrAuthor } from "@utils/auth";
import { formatDateReadableFromUTC } from "@utils/date";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Header({ datatable, authorName }) {
  const { t } = useTranslation();

  const pageTitle = `${datatable?.title} by ${authorName} on ${formatDateReadableFromUTC(
    datatable?.createdOn
  )}`;

  const pageDescription = `${datatable?.title} Observed by ${authorName} at ${
    datatable?.geographicalCoveragePlaceName || "Unknown"
  } on ${formatDateReadableFromUTC(datatable?.createdOn)}`;

  const PageActions = () => (
    <div>
      {adminOrAuthor(datatable.uploaderId) && (
        <DeleteActionButton
          observationId={datatable?.id}
          title={t("datatable:deleted_datatable")}
          description={t("observation:remove.description")}
          deleted={t("datatable:notifications.success_deleted")}
          deleteFunc={axDeleteObservationByDatatableId}
        />
      )}
    </div>
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
