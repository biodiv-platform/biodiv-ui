import { authorizedPageSSR } from "@components/auth/auth-redirect";
import DocumentEditPageComponent from "@components/pages/document/edit";
import { Role } from "@interfaces/custom";
import {
  axGetDocumentBibFields,
  axGetDocumentTypes,
  axGetEditDocumentById
} from "@services/document.service";
import React from "react";

const DocumentEditPage = (props) =>
  props.initialDocument ? <DocumentEditPageComponent {...props} /> : null;

DocumentEditPage.getInitialProps = async (ctx) => {
  authorizedPageSSR([Role.Any], ctx);

  const { data: initialDocument } = await axGetEditDocumentById(ctx, ctx.query.documentId);
  const { data: defaultBibFields } = await axGetDocumentBibFields(ctx.query.documentId);
  const { data: documentTypes } = await axGetDocumentTypes();

  return {
    initialDocument,
    defaultBibFields,
    documentTypes
  };
};

export default DocumentEditPage;
