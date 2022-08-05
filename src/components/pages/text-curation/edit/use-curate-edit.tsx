import { axUpdateDataset } from "@services/curate.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { createContext, useContext, useMemo, useState } from "react";

interface CurateEditContextProps {
  initialData;
  isShow;
  canEdit;
  datasetId;
  userName;
  canValidate;
  rows: {
    filtered;
    filter;
    setFilter;
    updateFilter;
    all;
    update;
  };
}

interface CurateEditProviderProps {
  initialData;
  datasetId;
  canEdit;
  isShow;
  children;
  userName;
  canValidate;
}

const CurateEditContext = createContext<CurateEditContextProps>({} as CurateEditContextProps);

export const CurateEditProvider = ({
  initialData,
  datasetId,
  canEdit,
  isShow,
  userName,
  canValidate,
  children
}: CurateEditProviderProps) => {
  const [rows, setRows] = useState<any[]>(initialData.data || []);
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});

  const updateRow = async (updatedRow) => {
    const { success } = await axUpdateDataset(updatedRow);
    if (success) {
      setRows(rows.map((row) => (row.id === updatedRow.id ? { ...row, ...updatedRow } : row)));
      notification(t("text-curation:update.success"), NotificationType.Success);
    } else {
      notification(t("text-curation:update.error"));
    }
  };

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
        isShow,
        canEdit,
        datasetId,
        userName,
        canValidate,
        rows: {
          filtered: filteredRows,
          filter,
          setFilter,
          updateFilter,
          all: rows,
          update: updateRow
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
