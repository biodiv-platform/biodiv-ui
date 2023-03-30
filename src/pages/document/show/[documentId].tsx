import DocumentShowComponent from "@components/pages/document/show";
import { axGetDocumentById } from "@services/document.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { axGetAllHabitat } from "@services/utility.service";
import { getDocumentURL, isLinkPDF } from "@utils/document";
import React from "react";

const DocumentShowPage = (props) => <DocumentShowComponent {...props} />;

export const getServerSideProps = async (ctx) => {
  const [document, speciesGroups, habitatList] = await Promise.all([
    axGetDocumentById(ctx.query.documentId),
    axGetSpeciesGroupList(),
    axGetAllHabitat()
  ]);

  const showViewer = await isLinkPDF(getDocumentURL(document.data));

  return {
    props: {
      document: document.data,
      speciesGroups: speciesGroups.data,
      habitatList: habitatList.data,
      showViewer
    }
  };
};

export default DocumentShowPage;
