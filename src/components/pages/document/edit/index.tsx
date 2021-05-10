import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import SubmitButton from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axUpdateDocument } from "@services/document.service";
import { dateToUTC, formatDateFromUTC } from "@utils/date";
import { getBibFieldsMeta } from "@utils/document";
import notification, { NotificationType } from "@utils/notification";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import BasicInfo from "../create/basic-info";
import WKTCoverage from "../create/coverage/wkt-coverage";
import Metadata from "../create/metadata";
import DocumentUploader from "../create/uploader";

export default function DocumentEditPageComponent({
  initialDocument,
  defaultBibFields,
  documentTypes,
  licensesList
}) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const [bibField, setBibField] = useState(getBibFieldsMeta(defaultBibFields));

  const ufileData = initialDocument.ufileData;

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        itemTypeId: Yup.number().required(),
        bibFieldData: Yup.object().shape(bibField.schema),

        contribution: Yup.string(),
        licenseId: Yup.number().required(),
        fromDate: Yup.mixed(),

        ufileData: Yup.lazy((value) =>
          value
            ? Yup.object()
                .shape({
                  id: Yup.string().nullable(),
                  resourceURL: Yup.string().required(),
                  size: Yup.number().required()
                })
                .required()
            : Yup.mixed().notRequired()
        ),

        tags: Yup.array().nullable(),

        docCoverageData: Yup.array().of(
          Yup.object().shape({
            id: Yup.mixed().nullable(),
            placeName: Yup.string().required(),
            topologyWKT: Yup.string().required()
          })
        )
      })
    ),
    defaultValues: {
      itemTypeId: initialDocument.itemTypeId,
      bibFieldData: initialDocument.bibFieldData,

      contribution: initialDocument.contribution,
      licenseId: initialDocument?.licenseId?.toString(),
      fromDate: formatDateFromUTC(initialDocument.fromDate),

      ufileData: ufileData
        ? {
            id: ufileData.id,
            resourceURL: ufileData.path,
            size: Number(ufileData.size)
          }
        : null,

      docCoverage: initialDocument.docCoverage
    }
  });

  const handleOnSubmit = async (values) => {
    const payload = {
      ...values,
      documentId: initialDocument.documentId,
      attribution: initialDocument.attribution,
      rating: initialDocument.rating,
      fromDate: values.fromDate ? dateToUTC(values.fromDate) : null,

      bibFieldData: {
        ...initialDocument.bibFieldData,
        ...values.bibFieldData
      },

      ufileData: values.ufileData
        ? {
            id: values.ufileData.id,
            mimeType: "application/pdf",
            path: values.ufileData.resourceURL,
            size: values.ufileData.size
          }
        : null
    };
    const { success } = await axUpdateDocument(payload);
    if (success) {
      notification(t("DOCUMENT.EDIT.SUCCESS"), NotificationType.Success);
      router.push(`/document/show/${initialDocument.documentId}`, true);
    } else {
      notification(t("DOCUMENT.EDIT.ERROR"));
    }
  };

  return (
    <Box className="container mt" pb={6}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <PageHeading>📄 {t("DOCUMENT.EDIT.TITLE")}</PageHeading>
        <DocumentUploader form={hForm} name="ufileData" />
        <BasicInfo
          hForm={hForm}
          documentTypes={documentTypes}
          setBibField={setBibField}
          licensesList={licensesList}
        />
        <Metadata hForm={hForm} bibFields={bibField.fields} />
        <WKTCoverage
          hForm={hForm}
          name="docCoverage"
          nameTopology="topologyWKT"
          nameTitle="placeName"
        />
        <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
          {t("DOCUMENT.EDIT.TITLE")}
        </SubmitButton>
      </form>
    </Box>
  );
}
