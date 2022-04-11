import { axUpdateDataset } from "@services/curate.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { createContext, useContext, useState } from "react";

interface CurateEditContextProps {
  initialData;
  rows: {
    all;
    update;
    editing;
    setEditing;
    clearEditing;
  };
}

interface CurateEditProviderProps {
  initialData;
  children;
}

const CurateEditContext = createContext<CurateEditContextProps>({} as CurateEditContextProps);

export const CurateEditProvider = ({ initialData, children }: CurateEditProviderProps) => {
  const [rows, setRows] = useState<any[]>(initialData.data || []);
  const [editingRow, setEditingRow] = useState();
  const { t } = useTranslation();

  const updateRow = async (updatedRow) => {
    const { success } = await axUpdateDataset(updatedRow);
    if (success) {
      setRows(
        rows.map((row) => (row.uniqueId === updatedRow.uniqueId ? { ...row, ...updatedRow } : row))
      );
      notification(t("text-curation:update.success"), NotificationType.Success);
    } else {
      notification(t("text-curation:update.error"));
    }
  };

  const clearEditingRow = () => setEditingRow(undefined);

  return (
    <CurateEditContext.Provider
      value={{
        initialData,
        rows: {
          all: rows,
          update: updateRow,
          editing: editingRow,
          setEditing: setEditingRow,
          clearEditing: clearEditingRow
        }
      }}
    >
      {children}
    </CurateEditContext.Provider>
  );
};

export default function useCurateEdit() {
  return useContext(CurateEditContext);
}
