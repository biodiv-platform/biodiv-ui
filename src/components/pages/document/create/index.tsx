import { Box } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import SubmitButton from "@components/form/submit-button";
import SITE_CONFIG from "@configs/site-config.json";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axCreateDocument } from "@services/document.service";
import { DEFAULT_BIB_FIELDS, DEFAULT_BIB_FIELDS_SCHEMA } from "@static/document";
import { dateToUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import { cleanTags } from "@utils/tags";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import BasicInfo from "./basic-info";
import TagsInput from "./basic-info/tags-input";
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
  const { user } = useGlobalState();
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

        contribution: Yup.string(),
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
      contribution: user?.name,
      licenseId: SITE_CONFIG.LICENSE.DEFAULT
    }
  });

  const handleOnSubmit = async (values) => {
    const { resource, bibFieldData, itemTypeId, fromDate, tags, ...rest } = values;

    const payload = {
      ...DEFAULT_VALUES,
      ...rest,
      resourceURL: resource?.resourceURL,
      fromDate: dateToUTC(fromDate).format(),
      tags: cleanTags(tags),
      size: resource?.size,
      bibFieldData: {
        ...bibFieldData,
        "item type": documentTypes.find((o) => o.value === itemTypeId)?.label
      }
    };

    const { success, data } = await axCreateDocument(payload);

    if (success) {
      notification(t("DOCUMENT.CREATE.SUCCESS"), NotificationType.Success);
      router.push(`/document/show/${data.document.id}`, true);
    } else {
      notification(t("DOCUMENT.CREATE.ERROR"));
    }
  };

  return (
    <Box className="container mt" pb={6}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <PageHeading>📄 {t("DOCUMENT.CREATE.TITLE")}</PageHeading>
        <DocumentUploader form={hForm} name="resource" />
        <BasicInfo
          canImport={true}
          hForm={hForm}
          documentTypes={documentTypes}
          setBibField={setBibField}
          licensesList={licensesList}
        />
        <TagsInput hForm={hForm} />
        <Metadata hForm={hForm} bibFields={bibField.fields} />
        <Coverage hForm={hForm} speciesGroups={speciesGroups} habitats={habitats} />
        <SubmitButton leftIcon={<CheckIcon />} form={hForm}>
          {t("DOCUMENT.CREATE.TITLE")}
        </SubmitButton>
      </form>
    </Box>
  );
}
