import DocumentShowComponent from "@components/pages/document/show";
import { axGetDocumentById, axGetDocumentSpeciesGroups } from "@services/document.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const DocumentShowPage = (props) => <DocumentShowComponent {...props} />;

export const getServerSideProps = async (ctx) => {
  const { data: document } = await axGetDocumentById(ctx.query.documentId);
  const { data: speciesGroups } = await axGetDocumentSpeciesGroups();
  const { data: habitatList } = await axGetAllHabitat();

  return { props: { document, speciesGroups, habitatList } };
};

export default DocumentShowPage;
