import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Alert, Link, Spinner, useDisclosure } from "@chakra-ui/react";
import LocalLink, { useLocalRouter } from "@components/@core/local-link";
import { SubmitButton } from "@components/form/submit-button";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { AssetStatus } from "@interfaces/custom";
import { ObservationUpdateData } from "@interfaces/observation";
import { axUpdateObservation } from "@services/observation.service";
import { dateToUTC, formatDateFromUTC } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import { nanoid } from "nanoid";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import DateInputs from "../../create/form/date";
import LocationPicker from "../../create/form/location";
import Uploader from "../../create/form/uploader";

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
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        resources: Yup.array().of(
          Yup.object().shape({
            status: Yup.number().oneOf([AssetStatus.Uploaded, null], t("common:edit_not_uploaded"))
          })
        ),
        notes: Yup.string().nullable(),

        // Date and Location
        observedOn: Yup.string().required(),
        dateAccuracy: Yup.string().nullable().required(),
        observedAt: Yup.string().required(),
        reverseGeocoded: Yup.string().required(),
        locationScale: Yup.string().nullable().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        hidePreciseLocation: Yup.boolean()
      })
    ),
    defaultValues: {
      ...observation,
      resources: observation.resources?.map((r) => ({
        ...r,
        hashKey: nanoid(),
        status: AssetStatus.Uploaded,
        licenseId: r.licenseId?.toString(),
        isUsed: 1,
        rating: r.rating || 0
      })),
      observedOn: formatDateFromUTC(observation.observedOn)
    }
  });

  const handleOnSubmit = async (values) => {
    const payload = {
      ...values,
      resources: values.resources.map(({ path, url, type, caption, rating, licenseId }) => ({
        path,
        url,
        type,
        caption,
        rating,
        licenseId
      })),
      observedOn: dateToUTC(values.observedOn).format()
    };
    const { success } = await axUpdateObservation(payload, observationId);
    if (success) {
      notification("Observation Updated Successfully", NotificationType.Success);
      onClose();
      router.push(`/observation/show/${observationId}`, true);
    }
  };

  return isOpen ? (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnSubmit)}>
        <Uploader name="resources" licensesList={licensesList} isCreate={false} />
        <LocationPicker />
        <DateInputs showTags={false} />
        <LocalLink href={`/observation/show/${observationId}`} prefixGroup={true}>
          <Link>
            <Alert mb={4} borderRadius="md">
              {t("observation:edit_hint")} <ArrowForwardIcon />
            </Alert>
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
