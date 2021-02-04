import { Box, SimpleGrid } from "@chakra-ui/react";
import Activity from "@components/pages/observation/show/activity";
import Groups from "@components/pages/observation/show/groups";
import SITE_CONFIG from "@configs/site-config.json";
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
import { getDocumentPath } from "@utils/media";
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

  useEffect(() => {
    if (isLoggedIn) {
      axGetDocumentPermissions(document?.document?.id).then(
        ({ success, data }) => success && setPermission(data)
      );
    }
  }, [isLoggedIn]);

  return (
    <div className="container mt">
      <DocumentHeader document={document} />
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]}>
        <Box gridColumn="1/3">
          {document?.uFile?.path && (
            <DocumentIframe
              className="fadeInUp delay-2"
              src={getDocumentPath(document?.uFile?.path)}
            />
          )}
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
        <Sidebar d={document} speciesGroups={speciesGroups} habitatList={habitatList} />
      </SimpleGrid>
    </div>
  );
}
