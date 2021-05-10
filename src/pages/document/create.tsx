import { authorizedPageSSR } from "@components/auth/auth-redirect";
import DocumentCreatePageComponent from "@components/pages/document/create";
import { Role } from "@interfaces/custom";
import { axGetDocumentSpeciesGroups, axGetDocumentTypes } from "@services/document.service";
import { axGetLicenseList } from "@services/resources.service";
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

  const { data: speciesGroups } = await axGetDocumentSpeciesGroups();
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
