import { Button } from "@chakra-ui/react";
import { axGetTaxonDetails, axGetTaxonRanks } from "@services/taxonomy.service";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import useTaxonFilter, { TaxonFilterContext } from "../../use-taxon";
import { TaxonModalTabs } from "./tabs";

interface TaxonShowModalProps {
  taxonId?: any;
  onClose?: () => void;
}

export default function TaxonShowModal({
  taxonId: propTaxonId,
  onClose: propOnClose
}: TaxonShowModalProps = {}) {
  const { t } = useTranslation();
  const context = useTaxonFilter();

  const isStandalone = propTaxonId !== undefined || propOnClose !== undefined;

  const [modalTaxon, setModalTaxonI] = useState<any>();
  const [taxonRanks, setTaxonRanks] = useState<any[]>([]);

  useEffect(() => {
    if (isStandalone && propTaxonId != null) {
      axGetTaxonDetails(propTaxonId).then(({ success, data }) => {
        if (success && data) {
          const { taxonomyDefinition, ...extra } = data;
          setModalTaxonI({ ...taxonomyDefinition, ...extra });
        }
      });
      axGetTaxonRanks().then(({ success, data }) => {
        if (success && Array.isArray(data)) {
          setTaxonRanks(data.map((r) => ({ ...r, value: r.name, label: r.name })));
        }
      });
    }
  }, [isStandalone, propTaxonId]);

  const setModalTaxon = async (taxon) => {
    const data = {
      ...taxon,
      ...taxon?.taxonomyDefinition,
      taxonomyDefinition: undefined
    };
    if (data) {
      setModalTaxonI(data);
    }
  };

  const showTaxon = isStandalone ? propTaxonId : context.showTaxon;

  const handleOnClose = () => {
    if (isStandalone) {
      propOnClose?.();
    } else {
      context.setShowTaxon?.(undefined);
    }
  };

  const content = (
    <DialogRoot
      open={showTaxon != null && showTaxon !== false && showTaxon !== ""}
      onOpenChange={(e) => {
        if (!e.open) handleOnClose();
      }}
      size="xl"
      scrollBehavior="inside"
    >
      <DialogContent
        maxH={{ base: "calc(100dvh - 2rem)", md: "calc(100% - 7.5rem)" }}
        m={{ base: 2, sm: "auto" }}
      >
        <DialogHeader
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight={"bold"}
          px={{ base: 4, md: 6 }}
          pt={{ base: 4, md: 6 }}
        >
          {t("taxon:modal.title")}
        </DialogHeader>
        <DialogCloseTrigger top={{ base: 3, md: 2 }} insetEnd={{ base: 3, md: 2 }} />
        <DialogBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }} overflowX="hidden">
          <TaxonModalTabs />
        </DialogBody>
        <DialogFooter px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
          <Button colorPalette="blue" onClick={handleOnClose}>
            {t("common:close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );

  if (isStandalone) {
    return (
      <TaxonFilterContext.Provider
        value={{
          showTaxon: propTaxonId,
          setShowTaxon: (val) => {
            if (!val) handleOnClose();
          },
          modalTaxon,
          setModalTaxon,
          taxonRanks
        }}
      >
        {content}
      </TaxonFilterContext.Provider>
    );
  }

  return content;
}
