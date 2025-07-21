import { Box, SimpleGrid } from "@chakra-ui/react";
import Activity from "@components/pages/observation/show/activity";
import Groups from "@components/pages/observation/show/groups";
import SITE_CONFIG from "@configs/site-config";
import styled from "@emotion/styled";
import useGlobalState from "@hooks/use-global-state";
import { DocumentUserPermission, ShowDocument } from "@interfaces/document";
import { axAddDocumentComment } from "@services/activity.service";
import {
  axDocumentGroupsFeature,
  axDocumentGroupsUnFeature,
  axDocumentSaveUserGroups,
  axGetDocumentPermissions
} from "@services/document.service";
import { RESOURCE_TYPE } from "@static/constants";
import { ACCEPTED_MIME_TYPE } from "@static/document";
import { getDocumentURL } from "@utils/document";
import { getDocumentFilePath, getDocumentPath } from "@utils/media";
import React, { useEffect, useState } from "react";

import DocumentHeader from "./header";
import DocumentInfo from "./info";
import Sidebar from "./sidebar";

const DocumentIframe = styled.iframe`
  background: #3b3b3b;
  border-radius: 0.25rem;
  width: 100%;
  height: 522px;
  grid-column: 1/3;
  margin-bottom: 1rem;
`;

interface DocumentShowProps {
  document: ShowDocument;
  speciesGroups;
  habitatList;
}

export default function DocumentShowComponent({
  document,
  speciesGroups,
  habitatList
}: DocumentShowProps) {
  const { isLoggedIn } = useGlobalState();
  const [permission, setPermission] = useState<DocumentUserPermission>();
  const documentPath = getDocumentURL(document);

  useEffect(() => {
    if (isLoggedIn) {
      axGetDocumentPermissions(document?.document?.id).then(
        ({ success, data }) => success && setPermission(data)
      );
    }
  }, [isLoggedIn]);

  const getDocumentType = (mimeType) => {
    if (!document.uFile && !document.document?.externalUrl) {
      return ACCEPTED_MIME_TYPE.PDF;
    }
    if (document?.document?.externalUrl || mimeType.includes(ACCEPTED_MIME_TYPE.PDF)) {
      return ACCEPTED_MIME_TYPE.PDF;
    }
    if (mimeType.includes(ACCEPTED_MIME_TYPE.VIDEO)) {
      return ACCEPTED_MIME_TYPE.VIDEO;
    }
    return undefined;
  };

  const renderDocument = (fileExtension: string | undefined) => {
    switch (fileExtension) {
      case ACCEPTED_MIME_TYPE.VIDEO:
        return (
          <Box>
            <video width="100%" controls>
              <source src={getDocumentFilePath(documentPath)} />
            </video>
          </Box>
        );
      case ACCEPTED_MIME_TYPE.PDF:
        return <DocumentIframe className="fadeInUp delay-2" src={getDocumentPath(documentPath)} />;
    }
  };

  return (
    <div className="container mt">
      <DocumentHeader document={document} />
      <SimpleGrid columns={[1, 1, 3, 3]} gap={[1, 1, 4, 4]}>
        <Box gridColumn="1/3">
          {renderDocument(getDocumentType(document?.uFile?.mimeType))}
          <DocumentInfo d={document} />

          {SITE_CONFIG.USERGROUP.ACTIVE && (
            <Groups
              resourceId={document?.document?.id}
              observationGroups={document?.userGroupIbp}
              featured={document?.featured}
              permission={permission}
              resourceType={RESOURCE_TYPE.OBSERVATION}
              saveUserGroupsFunc={axDocumentSaveUserGroups}
              featureFunc={axDocumentGroupsFeature}
              unfeatureFunc={axDocumentGroupsUnFeature}
            />
          )}

          <Activity
            resourceId={document?.document?.id}
            resourceType={RESOURCE_TYPE.DOCUMENT}
            commentFunc={axAddDocumentComment}
          />
        </Box>
        <Sidebar
          showDocument={document}
          speciesGroups={speciesGroups}
          habitatList={habitatList}
          documentPath={documentPath}
        />
      </SimpleGrid>
    </div>
  );
}
