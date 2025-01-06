import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Spinner
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import GroupCustomField from "@components/pages/group/common/custom-field";
import { Role } from "@interfaces/custom";
import { getParsedUser, hasAccess } from "@utils/auth";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import ContactAdmin from "./contact-admin";
import UserGroupEditForm from "./form";
import GroupAdministratorsEditForm from "./group-administrator-edit-form";
import GroupRules from "./group-rules";
import GroupHomePageCustomization from "./homepage-customization";
import ObservationCustomizations from "./observation-customisation";
import SpeciesHierarchyForm from "./species-hierarchy-form";

interface GroupEditPageProps {
  speciesGroups;
  habitats;
  customFieldList;
  allCustomField;
  groupInfo;
  groupRules;
  founders;
  homePageDetails;
  moderators;
  userGroupId;
  mediaToggle;
}

export default function EditGroupPageComponent({
  speciesGroups,
  customFieldList,
  allCustomField,
  groupRules,
  habitats,
  groupInfo,
  founders,
  moderators,
  homePageDetails,
  userGroupId,
  mediaToggle
}: GroupEditPageProps) {
  const { t } = useTranslation();
  const isAdmin = hasAccess([Role.Admin]);
  const isFounder = founders.some((founder) => founder.value === getParsedUser().id);

  return (
    <div className="container mt">
      <PageHeading>👥 {t("group:edit.title")}</PageHeading>

      {groupInfo ? (
        <UserGroupEditForm
          groupInfo={groupInfo}
          userGroupId={userGroupId}
          habitats={habitats}
          speciesGroups={speciesGroups}
        />
      ) : (
        <Spinner mb={10} />
      )}
      <GroupAdministratorsEditForm
        userGroupId={userGroupId}
        founders={founders}
        moderators={moderators}
      />
      <GroupHomePageCustomization userGroupId={userGroupId} homePageDetails={homePageDetails} />
      <Accordion allowToggle={true}>
        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
        >
          <AccordionButton _expanded={{ bg: "gray.100" }}>
            <Box flex={1} textAlign="left" fontSize="lg">
              🧰 {t("group:observation_customisation")}
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel p={4}>
            {isAdmin ? (
              <div>
                <GroupCustomField
                  allCustomField={allCustomField}
                  userGroupId={userGroupId}
                  groupCustomField={customFieldList}
                />
                <GroupRules rules={groupRules} userGroupId={userGroupId} />
              </div>
            ) : (
              <ContactAdmin />
            )}
            {(isAdmin || isFounder) && (
              <ObservationCustomizations userGroupId={userGroupId} mediaToggle={mediaToggle} />
            )}
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
        >
          <h2>
            <AccordionButton _expanded={{ bg: "gray.100" }}>
              <Box flex={1} textAlign="left" fontSize="lg">
                Species fields
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <SpeciesHierarchyForm
              onSubmit={(selectedNodes) => {
                console.log("Selected nodes:", selectedNodes);
              }}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
