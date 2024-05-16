import DocumentShowComponent from "@components/pages/document/show";
import { axGetDocumentById } from "@services/document.service";
import { axGetSpeciesGroupList } from "@services/taxonomy.service";
import { axGetAllHabitat } from "@services/utility.service";
import React from "react";

const DocumentShowPage = (props) => <DocumentShowComponent {...props} />;

export const getServerSideProps = async (ctx) => {
  const [document, speciesGroups, habitatList] = await Promise.all([
    axGetDocumentById(ctx.query.documentId),
    axGetSpeciesGroupList(),
    axGetAllHabitat()
  ]);

  return {
    props: {
      document: document.data,
      speciesGroups: speciesGroups.data,
      habitatList: habitatList.data
    }
  };
};

export default DocumentShowPage;
