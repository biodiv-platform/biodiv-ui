import { axUpdateDataset } from "@services/curate.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { createContext, useContext, useMemo, useState } from "react";

interface CurateEditContextProps {
  initialData;
  rows: {
    filtered;
    filter;
    setFilter;
    updateFilter;
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
  const [filter, setFilter] = useState({});

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

  const updateFilter = (key, value?) => setFilter({ ...filter, [key]: value || undefined });

  const filteredRows = useMemo(() => {
    const _filters = Object.entries(filter).filter((o) => o[1]);

    if (_filters.length > 0) {
      return rows.filter((row) => {
        for (const [key, value] of _filters) {
          if (row[key] === value) {
            return true;
          }
        }
        return false;
      });
    } else {
      return rows;
    }
  }, [filter, rows]);

  return (
    <CurateEditContext.Provider
      value={{
        initialData,
        rows: {
          filtered: filteredRows,
          filter,
          setFilter,
          updateFilter,
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
