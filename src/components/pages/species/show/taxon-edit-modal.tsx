import { Button } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import { axGetSpeciesIdFromTaxonId, axUpdateSpeciesTaxonId } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { SubmitButton } from "@/components/form/submit-button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";
import CheckIcon from "@/icons/check";

interface TaxonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  species: any;
  onTaxonUpdated: (newTaxonId: number) => void;
}

const onQuery = (q) => onScientificNameQuery(q, "id");

export default function TaxonEditModal({
  isOpen,
  onClose,
  species,
  onTaxonUpdated
}: TaxonEditModalProps) {
  const formRef = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        taxon: Yup.mixed().nullable()
      })
    )
  });

  const { t } = useTranslation();

  const handleSave = async (value) => {
    if (!value) {
      notification(t("species:please_select_a_taxon"));
      return;
    }

    const { success, data: speciesIdFromTaxon } = await axGetSpeciesIdFromTaxonId(value.taxon);

    if (success && speciesIdFromTaxon != species.species.id) {
      notification(t("species:species_already_exists"));
      return;
    }

    try {
      const result = await axUpdateSpeciesTaxonId(species.species.id, value.taxon);

      if (result.success) {
        notification(t("species:taxon_updated_successfully"), NotificationType.Success);
        onTaxonUpdated(value.taxon);

        onClose();
      } else {
        notification(t("species:failed_to_update_taxon"));
      }
    } catch (error) {
      console.error("Failed to update taxon:", error);
      notification(t("species:failed_to_update_taxon"), NotificationType.Error);
    }
  };
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      closeOnInteractOutside={false}
      trapFocus={false}
      preventScroll={false}
      modal={false}
    >
      <DialogContent>
        <FormProvider {...formRef}>
          <form onSubmit={formRef.handleSubmit(handleSave)}>
            <DialogHeader>{t("species:update_taxon")}</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <SelectAsyncInputField
                name="taxon"
                onQuery={onQuery}
                optionComponent={ScientificNameOption}
                placeholder={t("species:search_for_a_new_taxon_name")}
                resetOnSubmit={false}
                openMenuOnFocus={true}
                style={{
                  menuPortal: (base) => ({ ...base, zIndex: 10000 }),
                  menu: (base) => ({ ...base, zIndex: 10000 })
                }}
              />
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActionTrigger>
              <SubmitButton leftIcon={<CheckIcon />} children="Save" />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );
}
