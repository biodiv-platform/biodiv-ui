import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { SubmitButton } from "@components/form/submit-button";
import UserGroups from "@components/pages/observation/create/form/user-groups";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axCreateDocument } from "@services/document.service";
import { DEFAULT_BIB_FIELDS, DEFAULT_BIB_FIELDS_SCHEMA } from "@static/document";
import { dateToUTC, formatDate } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import { cleanTags } from "@utils/tags";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import BasicInfo from "./basic-info";
import Coverage from "./coverage";
import Metadata from "./metadata";
import DocumentUploader from "./uploader";

const DEFAULT_VALUES = {
  userGroupId: [],
  geoentitiesId: [],
  mimeType: "application/pdf",
  size: 0,
  rating: 0
};

export default function DocumentCreatePageComponent({
  speciesGroups,
  habitats,
  documentTypes,
  licensesList
}) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const [bibField, setBibField] = useState({
    schema: DEFAULT_BIB_FIELDS_SCHEMA,
    fields: DEFAULT_BIB_FIELDS
  });

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        itemTypeId: Yup.number().required(),
        bibFieldData: Yup.object().shape(bibField.schema),

        licenseId: Yup.number().required(),
        fromDate: Yup.mixed(),

        resource: Yup.lazy((value) =>
          value
            ? Yup.object().shape({
                resourceURL: Yup.string().required(),
                size: Yup.number().required()
              })
            : Yup.mixed().notRequired()
        ),

        tags: Yup.array().nullable(),

        speciesGroupIds: Yup.array(),
        habitatIds: Yup.array(),

        docCoverageData: Yup.array().of(
          Yup.object().shape({
            id: Yup.mixed().nullable(),
            placename: Yup.string().required(),
            topology: Yup.string().required()
          })
        ),

        userGroupId: Yup.array()
      })
    ),
    defaultValues: {
      bibFieldData: {},
      tags: [],
      speciesGroupIds: [],
      habitatIds: [],
      docCoverageData: [],
      userGroupId: [],
      licenseId: licensesList?.[0]?.value
    }
  });

  const handleOnSubmit = async (values) => {
    const { resource, bibFieldData, itemTypeId, fromDate, tags, ...rest } = values;

    const payload = {
      ...DEFAULT_VALUES,
      ...rest,
      resourceURL: resource?.resourceURL,
      fromDate: fromDate ? dateToUTC(formatDate(fromDate)).format() : null,
      tags: cleanTags(tags),
      size: resource?.size,
      bibFieldData: {
        ...bibFieldData,
        "item type": documentTypes.find((o) => o.value === itemTypeId)?.label
      }
    };

    const { success, data } = await axCreateDocument(payload);

    if (success) {
      notification(t("document:create.success"), NotificationType.Success);
      router.push(`/document/show/${data.document.id}`, true);
    } else {
      notification(t("document:create.error"));
    }
  };

  return (
    <Box className="container mt" pb={6}>
      <FormProvider {...hForm}>
        <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
          <PageHeading>📄 {t("document:create.title")}</PageHeading>
          <DocumentUploader name="resource" />
          <BasicInfo
            canImport={true}
            documentTypes={documentTypes}
            setBibField={setBibField}
            licensesList={licensesList}
          />
          <Metadata bibFields={bibField.fields} />
          <Coverage speciesGroups={speciesGroups} habitats={habitats} />
          <UserGroups name="userGroupId" label={t("observation:post_to_groups")} />
          <SubmitButton leftIcon={<CheckIcon />}>{t("document:create.title")}</SubmitButton>
        </form>
      </FormProvider>
    </Box>
  );
}
