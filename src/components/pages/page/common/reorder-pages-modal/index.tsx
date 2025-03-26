import "react-sortable-tree/style.css";

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

import usePages from "../sidebar/use-pages-sidebar";
import ReOrderTree from "./reorder-tree";

export default function ReOrderPagesModal() {
  const { t } = useTranslation();
  const p = usePages();

  const handleOnSave = async () => {
    await p.savePages();
    p.toggleEditing();
  };

  return (
    <>
      <Button mb={3} w="full" colorPalette="blue" onClick={p.toggleEditing}>
        {t("page:sidebar.reorder")}
      </Button>

      <DialogRoot open={p.isEditing} onOpenChange={p.toggleEditing}>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>{t("page:sidebar.reorder")}</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            <ReOrderTree />
          </DialogBody>

          <DialogFooter>
            <Button colorPalette="blue" onClick={handleOnSave}>
              {t("common:save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}
