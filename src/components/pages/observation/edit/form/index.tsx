import { Alert, Link, Spinner, useDisclosure } from "@chakra-ui/react";
import LocalLink, { useLocalRouter } from "@components/@core/local-link";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { AssetStatus } from "@interfaces/custom";
import { ObservationUpdateData } from "@interfaces/observation";
import { axUpdateObservation } from "@services/observation.service";
import { dateToUTC, formatDate, parseDateFromUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import { nanoid } from "nanoid";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { LuMoveRight } from "react-icons/lu";
import * as Yup from "yup";

// import { Alert } from "@/components/ui/alert";
import LocationPicker from "../../create/form/location";
import Uploader from "../../create/form/uploader";
import CheckListAnnotationForm from "./checklist-annotation";
import DateInputs from "./date-input";

interface IObservationEditFormProps {
  observation: ObservationUpdateData;
  observationId;
  licensesList;
}

export default function ObservationEditForm({
  observation,
  observationId,
  licensesList
}: IObservationEditFormProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { open, onClose } = useDisclosure({ defaultOpen: true });

  const parsechecklistAnnotations = (checklistAnnotations) => {
    if (checklistAnnotations) {
      return Object.entries(JSON.parse(checklistAnnotations)).map(([key, value]) => ({
        value,
        label: key,
        defaultValue: value
      }));
    }
  };

  const formatChecklistAnnotation = (value) => {
    const formatData = {};
    if (value) {
      value.map((item) => {
        formatData[item.label] = item.value;
      });
      return JSON.stringify(formatData);
    }
  };

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        resources: Yup.array()
          .of(
            Yup.object().shape({
              status: Yup.number().oneOf(
                [AssetStatus.Uploaded, null],
                t("common:edit_not_uploaded")
              )
            })
          )
          .when("dataTableId", (dataTableId, schema) =>
            dataTableId ? schema : schema.min(1).required("")
          ),
        notes: Yup.string().nullable(),
        // Date and Location
        observedOn: Yup.string().when("dateAccuracy", (dateAccuracy, schema) =>
          dateAccuracy === "UNKNOWN" ? schema : schema.required()
        ),
        dateAccuracy: Yup.string().nullable().required(),
        observedAt: Yup.string().required(),
        reverseGeocoded: Yup.string().required(),
        locationScale: Yup.string().nullable().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        hidePreciseLocation: Yup.boolean(),
        dataTableId: Yup.number().nullable(),
        basisOfRecord: Yup.string().required(),
        checklistAnnotations: Yup.array().of(
          Yup.object().shape({
            value: Yup.string(),
            label: Yup.string(),
            defaultValue: Yup.string()
          })
        )
      })
    ),
    defaultValues: {
      ...observation,
      checklistAnnotations: parsechecklistAnnotations(observation?.checklistAnnotations),
      resources: observation?.resources?.map((r) => ({
        ...r,
        hashKey: nanoid(),
        status: AssetStatus.Uploaded,
        licenseId: r.licenseId?.toString(),
        isUsed: 1,
        rating: r.rating || 0
      })),
      observedOn: observation.observedOn ? parseDateFromUTC(observation.observedOn) : undefined
    }
  });

  const { fields }: any = useFieldArray({
    control: hForm.control,
    name: "checklistAnnotations"
  });

  const handleOnSubmit = async (values) => {
    const payload = {
      ...values,
      checklistAnnotations: formatChecklistAnnotation(values.checklistAnnotations),
      resources: values?.resources?.map(
        ({ path, url, type, caption, contributor, rating, licenseId, languageId }) => ({
          path,
          url,
          type,
          contributor,
          caption,
          rating,
          licenseId,
          languageId
        })
      ),
      observedOn: dateToUTC(formatDate(values.observedOn)).format()
    };
    const { success } = await axUpdateObservation(payload, observationId);

    if (success) {
      notification("Observation Updated Successfully", NotificationType.Success);
      onClose();
      router.push(`/observation/show/${observationId}`, true);
    }
  };

  return open ? (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <Uploader name="resources" licensesList={licensesList} isCreate={false} />
        <LocationPicker />
        <DateInputs
          showTags={false}
          disabled={observation.dateAccuracy === "UNKNOWN" ? true : false}
        />
        {observation.checklistAnnotations && <CheckListAnnotationForm fields={fields} />}
        <LocalLink href={`/observation/show/${observationId}`} prefixGroup={true}>
          <Link unstyled>
            <Alert.Root status="info" mb={4} borderRadius="md">
              <Alert.Title>
                {t("observation:edit_hint")} <LuMoveRight />
              </Alert.Title>
            </Alert.Root>
          </Link>
        </LocalLink>
        <SubmitButton leftIcon={<CheckIcon />} mb={4}>
          {t("observation:update_observation")}
        </SubmitButton>
      </form>
    </FormProvider>
  ) : (
    <Spinner />
  );
}
