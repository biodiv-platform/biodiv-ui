import React from "react";

import { DialogBackdrop, DialogRoot } from "@/components/ui/dialog";

import { TaxonPermissionRequestForm } from "./form";

export function TaxonPermissionRequestModal({ taxon, isOpen, onClose, isAdmin }) {
  return (
    <DialogRoot onOpenChange={onClose} size="md" open={isOpen}>
      <DialogBackdrop />
      {isOpen && <TaxonPermissionRequestForm taxon={taxon} isAdmin={isAdmin} onClose={onClose} />}
    </DialogRoot>
  );
}
