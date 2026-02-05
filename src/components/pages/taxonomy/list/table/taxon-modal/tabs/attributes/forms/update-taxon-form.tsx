import { Box, useDisclosure } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { SelectAsyncInputField } from "@components/form/select-async";
import { SubmitButton } from "@components/form/submit-button";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { TaxonCreateInputField } from "@components/pages/species/create/species-taxon-suggestions/create/taxon-create-input";
import TaxonCreateModal from "@components/pages/species/create/species-taxon-suggestions/create/taxon-create-modal";
import useTaxonFilter from "@components/pages/taxonomy/list/use-taxon";
import { yupResolver } from "@hookform/resolvers/yup";
import CheckIcon from "@icons/check";
import { axCheckTaxonomy, axUpdateTaxonStatus } from "@services/taxonomy.service";
import { TAXON_STATUS, TAXON_STATUS_VALUES } from "@static/taxon";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import ExternalBlueLink from "@/components/@core/blue-link/external";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import useGlobalState from "@/hooks/use-global-state";
import { axGetTaxonList } from "@/services/api.service";
import { parseUrl, stringify } from "@/utils/query-string";

export default function UpdateTaxonForm({ onDone }) {
  const { modalTaxon, taxonRanks, setModalTaxon } = useTaxonFilter();
  const { t } = useTranslation();
  const [validateResults, setValidateResults] = useState([]);
  const { open, onClose, onOpen } = useDisclosure();
  const { currentGroup } = useGlobalState();

  const getLocalPath = (href, params = {}, prefixGroup?, currentGroup?) => {
    const groupPrefixPath =
      currentGroup && prefixGroup && !href.startsWith("http") ? currentGroup + href : href;

    const cleanPath = groupPrefixPath.startsWith(currentGroup)
      ? groupPrefixPath.replace(/^.*\/\/[^\/]+/, "")
      : groupPrefixPath;

    const newParams = stringify({ ...parseUrl(href).query, ...params });

    return cleanPath + (newParams ? `?${newParams}` : "");
  };

  const [formValidationSchema, formDisabled] = useMemo(() => {
    const validation: [string, any][] = [];
    const disabled: [string, boolean, boolean][] = [];

    let found = false;

    taxonRanks.forEach(({ name, isRequired }) => {
      // Push Yup Schema
      const required = isRequired ? found : false;
      validation.push([
        name,
        required
          ? Yup.string().when("status", {
              is: (m) => m === TAXON_STATUS_VALUES.ACCEPTED,
              then: Yup.string().required()
            })
          : Yup.string().notRequired()
      ]);

      // Push to Disabled
      disabled.push([name, required, !found]);

      // check for match
      if (modalTaxon?.rank === name) {
        found = true;
      }
    });

    return [Object.fromEntries(validation), disabled];
  }, [modalTaxon]);

  const hForm = useForm<any>({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        status: Yup.string().required(),
        newTaxonId: Yup.mixed().when("status", {
          is: (m) => m === TAXON_STATUS_VALUES.SYNONYM,
          then: Yup.array()
            .of(
              Yup.object().shape({
                value: Yup.number().required(),
                label: Yup.string().required()
              })
            )
            .min(1)
            .required()
        }),
        ...formValidationSchema
      })
    ),
    defaultValues: {
      status: modalTaxon?.status,
      newTaxonId: modalTaxon?.acceptedNames?.map((o) => ({ value: o.id, label: o.name })) || [],
      ...Object.fromEntries(
        modalTaxon?.hierarchy?.map((o) => [
          o.rankName,
          modalTaxon?.rank === o.rankName ? modalTaxon?.name : o.name
        ]) || []
      )
    }
  });

  const hFormWatch = hForm.watch("status");

  const handleOnRankValidate = async (rankName, scientificName) => {
    // clear results
    setValidateResults([]);

    const { success, data } = await axCheckTaxonomy({ rankName, scientificName });

    if (success) {
      // clear error for current field since no match should also be treated as valid
      hForm.clearErrors(rankName);

      // if results are available show select dialouge
      if (data.matched) {
        setValidateResults(data.matched);
        onOpen();
      }
    } else {
      notification(t("species:create.validate_error"));
    }
  };

  const handleOnStatusFormSubmit = async ({ newTaxonId, status, ...hierarchy }) => {
    if (status === TAXON_STATUS_VALUES.SYNONYM) {
      const treeData = await axGetTaxonList({
        expand_taxon: true,
        key: modalTaxon.id
      });
      if (treeData.length > 0) {
        toaster.create({
          title: "Warning",
          description: (
            <div>
              {"This name cannot be converted to a synonym because it has child taxa:"}
              {treeData.map((child) => (
                <div>
                  <ExternalBlueLink
                    key={child.id}
                    href={getLocalPath(
                      "/taxonomy/list",
                      { taxonId: child.id, showTaxon: child.id },
                      true,
                      currentGroup?.webAddress
                    )}
                    target="_blank"
                  >
                    {child.text}
                  </ExternalBlueLink>
                </div>
              ))}
              <br />
              <div>
                {"You must first resolve these child taxa by either:"}
                <ol>
                  <li>1. Moving them to another accepted name</li>
                  <li>2. Making them synonyms</li>
                  <li>3. Deleting them (if appropriate)</li>
                </ol>
              </div>
            </div>
          ),
          type: "warning",
          duration: 9000,
          closable: true
        });
        return;
      }
    }
    const { success, data } = await axUpdateTaxonStatus({
      taxonId: modalTaxon.id,
      status,
      ...(status === TAXON_STATUS_VALUES.SYNONYM
        ? { newTaxonId: newTaxonId.map((t) => t.value) }
        : { hierarchy })
    });
    if (success) {
      setModalTaxon(data);
      onDone();
      notification(t("taxon:modal.attributes.position.success"), NotificationType.Success);
    } else {
      notification(t("taxon:modal.attributes.position.error"));
    }
  };

  return (
    <FormProvider {...hForm}>
      <form onSubmit={hForm.handleSubmit(handleOnStatusFormSubmit)}>
        <TaxonCreateModal isOpen={open} onClose={onClose} validateResults={validateResults} />

        <SelectInputField
          name="status"
          label={t("taxon:modal.attributes.status.title")}
          options={TAXON_STATUS}
          //shouldPortal={true}
          isRequired={true}
        />

        <Field label={t("taxon:modal.attributes.rank.title")} />
        <Box hidden={hFormWatch !== TAXON_STATUS_VALUES.ACCEPTED}>
          {formDisabled.map(([name, isRequired, isDisabled]) => (
            <TaxonCreateInputField
              key={name}
              name={name}
              label={name}
              isDisabled={isDisabled}
              onValidate={handleOnRankValidate}
              isRequired={isRequired}
            />
          ))}
        </Box>
        <Box hidden={hFormWatch !== TAXON_STATUS_VALUES.SYNONYM}>
          <SelectAsyncInputField
            name="newTaxonId"
            label={t("form:accepted_name")}
            multiple={true}
            onQuery={(q) => onScientificNameQuery(q)}
            optionComponent={ScientificNameOption}
            placeholder={t("form:min_three_chars")}
            isRaw={true}
            portalled={false}
          />
        </Box>

        <SubmitButton leftIcon={<CheckIcon />}>{t("common:save")}</SubmitButton>
      </form>
    </FormProvider>
  );
}
