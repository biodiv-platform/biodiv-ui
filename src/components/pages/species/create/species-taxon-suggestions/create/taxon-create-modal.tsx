import { Button } from "@chakra-ui/button";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/modal";
import { BasicTable, ResponsiveContainer } from "@components/@core/table";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useFormContext } from "react-hook-form";

import { SpeciesCreateCommonTableRows } from "../common-table-rows";

export default function TaxonCreateModal({ isOpen, onClose, validateResults }) {
  const { t } = useTranslation();
  const { setValue, clearErrors } = useFormContext();

  const applySuggestion = (result) => {
    result.registry.map((r) => setValue(r.rank, r.name));

    // This will clearErrors after values are applied
    setTimeout(clearErrors, 0);

    onClose();
  };

  const TaxonValidateTable = [
    ...SpeciesCreateCommonTableRows,
    {
      Header: "Actions",
      accessor: "taxonomyDefinition.nameSourceId",
      Cell: ({ cell }) => (
        <Button
          variant="link"
          colorScheme="blue"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => applySuggestion(cell.row.original)}
        >
          {t("species:create.form.select")}
        </Button>
      )
    }
  ];

  return (
    <Modal isOpen={isOpen} size="6xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Results</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ResponsiveContainer>
            <BasicTable data={validateResults || []} columns={TaxonValidateTable} />
          </ResponsiveContainer>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>{t("common:close")}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
