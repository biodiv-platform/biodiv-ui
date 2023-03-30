import { authorizedPageSSR } from "@components/auth/auth-redirect";
import DocumentCreatePageComponent from "@components/pages/document/create";
import { Role } from "@interfaces/custom";
import { axGetDocumentTypes } from "@services/document.service";
import { axGetLicenseList } from "@services/resources.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const DocumentCreatePage = ({ speciesGroups, habitats, documentTypes, licensesList }) => (
  <DocumentCreatePageComponent
    speciesGroups={speciesGroups}
    habitats={habitats}
    documentTypes={documentTypes}
    licensesList={licensesList}
  />
);

DocumentCreatePage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx);

  const { data: speciesGroups } = await axGetSpeciesGroupList();
  const { data: habitatList } = await axGetAllHabitat();
  const { data: licensesList } = await axGetLicenseList();
  const { data: documentTypes } = await axGetDocumentTypes();

  return {
    speciesGroups,
    documentTypes,
    licensesList,
    habitats: habitatList.map(({ name, id }) => ({ name, id, value: id }))
  };
};

export default DocumentCreatePage;
