import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

import ManageResourcesForm from "./form";

export default function ManageResourcesModal(props) {
  const { t } = useTranslation();

  return (
    <DialogRoot open={props.isOpen} onOpenChange={props.onClose}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader fontSize={"xl"} fontWeight={"bold"}>
          {t("observation:manage_resources")}
        </DialogHeader>
        <DialogCloseTrigger />
        <ManageResourcesForm {...props} />
      </DialogContent>
    </DialogRoot>
  );
}
