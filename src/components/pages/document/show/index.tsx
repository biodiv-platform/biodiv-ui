import { Box, SimpleGrid } from "@chakra-ui/core";
import Activity from "@components/pages/observation/show/activity";
import Groups from "@components/pages/observation/show/groups";
import SITE_CONFIG from "@configs/site-config.json";
import styled from "@emotion/styled";
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
import { useStoreState } from "easy-peasy";
import React, { useEffect, useState } from "react";

import DocumentHeader from "./header";
import DocumentInfo from "./info";
import Sidebar from "./sidebar";
import HabitatsCoverage from "./sidebar/habitats-coverage";
import SpatialCoverage from "./sidebar/special-coverage";
import SpeciesCoverage from "./sidebar/species-coverage";

const DocumentIframe = styled.iframe`
  background: #3b3b3b;
  border-radius: 0.25rem;
  width: 100%;
  height: 522px;
  grid-column: 1/3;
`;

interface DocumentShowProps {
  document: ShowDocument;
}

export default function DocumentShowComponent({ document }: DocumentShowProps) {
  const { isLoggedIn } = useStoreState((s) => s);
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
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]} mb={4}>
        <DocumentIframe className="fadeInUp delay-2" src={getDocumentPath(document?.uFile?.path)} />
        <Sidebar d={document} />
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={[1, 1, 4, 4]}>
        <Box gridColumn="1/3">
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
        <div>
          <SpatialCoverage documentCoverage={document.documentCoverages} />
          <HabitatsCoverage habitat={document.habitatIds} />
          <SpeciesCoverage speciesGroup={document.speciesGroupIds} />
        </div>
      </SimpleGrid>
    </div>
  );
}
