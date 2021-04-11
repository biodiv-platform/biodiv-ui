import { Box } from "@chakra-ui/react";
import CheckBox from "@components/form/checkbox";
import FormDebugger from "@components/form/debugger";
import Submit from "@components/form/submit-button";
import TitleInput from "./title";
import LocationPicker from "./geographic";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import Others from "./others";
import CheckIcon from "@icons/check";
import { DEFAULT_LICENSE } from "@static/licenses";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ImageUploaderField from "./uploader/index";
import FieldMappingInput from "./uploader/file-uploader-field/options-field";
import PartyContributorsForm from "./contributor";
import TaxonomyCovergae from "./taxonomic-coverage";
import TemporalCoverage from "./temporal-coverage";

export default function DataTableCreateForm({ speciesGroups, languages }) {
  const { t } = useTranslation();
  const { user } = useGlobalState();
  const [isSubmitDisabled] = useState(false);
  const [fieldMapping, setFieldMapping] = useState([]);
  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        title: Yup.string().required(),
        summary: Yup.string().required(),
        description: Yup.string(),
        licenseId: Yup.number().required(),
        languageId: Yup.number().required(),
        filename: Yup.string().required(),
        contributors: Yup.number().required(),
        attribution: Yup.string(),
        sgroup: Yup.number().required(),

        observedFromDate: Yup.string().required(),
        observedToDate: Yup.string().required(),
        project: Yup.string(),
        methods: Yup.string(),

        // Date and Location
        observedOn: Yup.string().required(),
        dateAccuracy: Yup.string().required(),
        observedAt: Yup.string().required(),
        reverseGeocoded: Yup.string().required(),
        locationScale: Yup.string().required(),
        latitude: Yup.number().required(),
        longitude: Yup.number().required(),
        useDegMinSec: Yup.boolean(),
        hidePreciseLocation: Yup.boolean(),

        columnsMapping: Yup.array().required()
      })
    ),
    defaultValues: {
      languageId: 205,
      contributors: user.id,
      licenseId: DEFAULT_LICENSE
    }
  });

  const handleFormSubmit = () => {
    // console.log("the form data setup is", fields);
    // console.log("the from submit added", hForm.getValues());
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
      <ImageUploaderField setFieldMapping={setFieldMapping} name={"filename"} form={hForm} />

      <FieldMappingInput fieldMapping={fieldMapping} name="columnsMapping" form={hForm} />

      <TitleInput form={hForm} languages={languages} />

      <TemporalCoverage form={hForm} />

      <TaxonomyCovergae form={hForm} speciesGroups={speciesGroups} />
      <LocationPicker form={hForm} />

      <PartyContributorsForm form={hForm} />

      <Others form={hForm} />

      <Box mt={4}>
        <CheckBox name="terms" label={t("OBSERVATION.TERMS")} form={hForm} />
      </Box>
      <FormDebugger form={hForm} />
      <Submit leftIcon={<CheckIcon />} form={hForm} isDisabled={isSubmitDisabled}>
        {t("OBSERVATION.ADD_OBSERVATION")}
      </Submit>
    </form>
  );
}
