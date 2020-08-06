import DocumentShowComponent from "@components/pages/document/show";
import { axGetDocumentById } from "@services/document.service";
import React from "react";

const DocumentShowPage = ({ document }) => <DocumentShowComponent document={document} />;

DocumentShowPage.getInitialProps = async (ctx) => {
  const { data: document } = await axGetDocumentById(ctx.query.documentId);
  return { document };
};

export default DocumentShowPage;
