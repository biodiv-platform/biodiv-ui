import AdminLayout from "@components/@core/layout/admin";
import SpeciesFieldTranslations from "@components/pages/admin/species-fields/translations";
import React from "react";

export default function TranslationsPage() {
  return (
    <AdminLayout>
      <SpeciesFieldTranslations />
    </AdminLayout>
  );
} 