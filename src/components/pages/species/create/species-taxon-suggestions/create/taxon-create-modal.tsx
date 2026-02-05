import { Button } from "@chakra-ui/react";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";
import { LuMoveRight } from "react-icons/lu";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import { SpeciesCreateCommonTableRows } from "../common-table-rows";

export default function TaxonCreateModal({ isOpen, onClose, validateResults }) {
  const { t } = useTranslation();
  const { setValue, clearErrors } = useFormContext();

  const applySuggestion = (result) => {
    result.registry.map((r) => setValue(r.rank, r.name, { shouldValidate: false }));

    // This will clearErrors after values are applied
    // This has to be executed 3rd after `react-hook-form` validation and `onChange` setError Validator
    setTimeout(() => {
      clearErrors();
      onClose();
    }, 10);
  };

  const TaxonValidateTable = [
    ...SpeciesCreateCommonTableRows,
    {
      Header: "Actions",
      accessor: "taxonomyDefinition.nameSourceId",
      Cell: ({ cell }) => (
        <Button
          variant="plain"
          colorPalette="blue"
          onClick={() => applySuggestion(cell.row.original)}
        >
          {t("species:create.form.select")}
          <LuMoveRight />
        </Button>
      )
    }
  ];

  return (
    <DialogRoot open={isOpen} size="cover" onOpenChange={onClose}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>Results</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>
          <ResponsiveContainer>
            <BasicTable data={validateResults || []} columns={TaxonValidateTable} />
          </ResponsiveContainer>
        </DialogBody>

        <DialogFooter>
          <Button onClick={onClose}>{t("common:close")}</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
