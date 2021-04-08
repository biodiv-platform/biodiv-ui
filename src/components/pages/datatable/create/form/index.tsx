import { Box } from "@chakra-ui/react";
import CheckBox from "@components/form/checkbox";
import Datepicker from "@components/form/datepicker";
import FormDebugger from "@components/form/debugger";
import RichTextareaField from "@components/form/rich-textarea";
import SelectInputField from "@components/form/select";
import Select from "@components/form/select";
import SelectAsyncInputField from "@components/form/select-async";
import Submit from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import TextAreaField from "@components/form/textarea";
import GroupSelector from "@components/pages/observation/create/form/groups";
import LocationPicker from "@components/pages/observation/create/form/location";
import { DATE_ACCURACY_OPTIONS } from "@components/pages/observation/create/form/options";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import useTranslation from "@hooks/use-translation";
import CheckIcon from "@icons/check";
import { axUserSearch } from "@services/auth.service";
import { DEFAULT_LICENSE, LICENSES_ARRAY } from "@static/licenses";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import ImageUploaderField from "./file-uploader-field";
import FieldMappingInput from "./file-uploader-field/options-field";

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
        contributors: Yup.string().required(),
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

  const onUserQuery = async (q) => {
    const { data } = await axUserSearch(q);
    return data.map((tag) => ({ label: tag.name, value: tag.id, version: tag.version }));
  };

  const handleFormSubmit = () => {
    // console.log("the form data setup is", fields);
    // console.log("the from submit added", hForm.getValues());
  };

  return (
    <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
      <TextBoxField name="title" label={t("DOCUMENT.TITLE")} form={hForm} isRequired={true} />

      <TextAreaField name="summary" form={hForm} label={t("GROUP.CUSTOM_FIELD.NOTES")} />

      <RichTextareaField name="description" label={t("GROUP.DESCRIPTION")} form={hForm} />

      <Select
        name="languageId"
        label={t("OBSERVATION.LANGUAGE")}
        options={languages}
        form={hForm}
      />
      <SelectInputField
        name="licenseId"
        label={t("DOCUMENT.LICENSE")}
        form={hForm}
        options={LICENSES_ARRAY}
        isRequired={true}
        isControlled={true}
      />
      <Datepicker
        name="observedOn"
        label={t("OBSERVATION.OBSERVED_ON")}
        style={{ gridColumn: "1/3" }}
        form={hForm}
        isRequired={true}
        subscribe={true}
        mb={0}
      />
      <Select
        name="dateAccuracy"
        label={t("OBSERVATION.DATE_ACCURACY")}
        options={DATE_ACCURACY_OPTIONS}
        form={hForm}
      />
      <GroupSelector
        name="sgroup"
        label={t("OBSERVATION.GROUPS")}
        options={speciesGroups}
        form={hForm}
      />
      <LocationPicker form={hForm} />

      <SelectAsyncInputField
        name="contributors"
        form={hForm}
        placeholder={t("GROUP.INVITE")}
        onQuery={onUserQuery}
        isRequired={true}
        label={t("Contributer")}
      />

      <TextBoxField name="attribution" label={t("Attribution")} form={hForm} />

      <TextBoxField name="project" label={t("Project")} form={hForm} />

      <TextBoxField name="methods" label={t("Methods")} form={hForm} />

      <ImageUploaderField
        simpleUpload={true}
        label={t("Sheet Uploader")}
        setFieldMapping={setFieldMapping}
        name={"filename"}
        form={hForm}
        mb={0}
      />

      <FieldMappingInput fieldMapping={fieldMapping} name="columnsMapping" form={hForm} />

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
