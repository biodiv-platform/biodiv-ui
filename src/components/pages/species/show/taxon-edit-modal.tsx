import { Button } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import { axUpdateSpeciesTaxonId } from "@services/species.service";
import notification, { NotificationType } from "@utils/notification";
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

  const handleSave = async (value) => {
    if (!value) {
      notification("Please select a taxon");
      return;
    }

    try {
      const result = await axUpdateSpeciesTaxonId(species.species.id, value.taxon);

      if (result.success) {
        notification("Taxon updated successfully", NotificationType.Success);
        //  setTaxon(value.taxon);
        onTaxonUpdated(value.taxon);

        onClose();
      } else {
        notification("Failed to update taxon");
      }
    } catch (error) {
      console.error("Failed to update taxon:", error);
      notification("Failed to update taxon", NotificationType.Error);
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
            <DialogHeader>Update Taxon</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              {/* <div>Hello</div> */}
              <SelectAsyncInputField
                name="taxon"
                onQuery={onQuery}
                optionComponent={ScientificNameOption}
                placeholder="Search for a new taxon name"
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
              {/* <Button ml={4} onClick={onEditClose} type="button" variant={"subtle"}>
                <CrossIcon />
                {t("common:cancel")}
              </Button> */}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );
}
