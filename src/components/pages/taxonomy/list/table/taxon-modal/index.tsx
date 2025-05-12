import { Button } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import useTaxonFilter from "../../use-taxon";
import { TaxonModalTabs } from "./tabs";

export default function TaxonShowModal() {
  const { t } = useTranslation();
  const { showTaxon, setShowTaxon } = useTaxonFilter();

  const handleOnClose = () => setShowTaxon(undefined);

  return (
    <>
      <DialogRoot open={showTaxon} onOpenChange={handleOnClose} size="xl">
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader fontSize={"2xl"} fontWeight={"bold"}>
            {t("taxon:modal.title")}
          </DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            <TaxonModalTabs />
          </DialogBody>
          <DialogFooter>
            <Button colorPalette="blue" onClick={handleOnClose}>
              {t("common:close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
