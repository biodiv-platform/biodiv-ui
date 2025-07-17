import { Box, Spinner } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import GroupCustomField from "@components/pages/group/common/custom-field";
import { Role } from "@interfaces/custom";
import { axUpdateSpeciesFieldsMapping } from "@services/usergroup.service";
import { getParsedUser, hasAccess } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from "@/components/ui/accordion";

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
  langId;
  traits;
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
  mediaToggle,
  langId,
  traits
}: GroupEditPageProps) {
  const { t } = useTranslation();
  const isAdmin = hasAccess([Role.Admin]);
  const isFounder = founders.some((founder) => founder.value === getParsedUser().id);

  const handleSpeciesFieldsSubmit = async (selectedNodes) => {
    const { success, data } = await axUpdateSpeciesFieldsMapping(userGroupId, selectedNodes);

    if (success) {
      notification("Fields successfully added", NotificationType.Success);
    } else {
      notification("Fields could not be added successfully");
    }

    return data;
  };

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
      <AccordionRoot multiple>
        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
          value="observation"
        >
          <AccordionItemTrigger _expanded={{ bg: "gray.100" }} pr={4}>
            <Box flex={1} textAlign="left" fontSize="lg" pl={4}>
              🧰 {t("group:observation_customisation")}
            </Box>
          </AccordionItemTrigger>

          <AccordionItemContent p={4}>
            {isAdmin ? (
              <div>
                <GroupCustomField
                  allCustomField={allCustomField}
                  userGroupId={userGroupId}
                  groupCustomField={customFieldList}
                />
                <GroupRules rules={groupRules} userGroupId={userGroupId} traits={traits} />
              </div>
            ) : (
              <ContactAdmin />
            )}
            {(isAdmin || isFounder) && (
              <ObservationCustomizations userGroupId={userGroupId} mediaToggle={mediaToggle} />
            )}
          </AccordionItemContent>
        </AccordionItem>

        <AccordionItem
          mb={8}
          bg="white"
          border="1px solid var(--chakra-colors-gray-300)"
          borderRadius="md"
          value="species"
        >
          <h2>
            <AccordionItemTrigger _expanded={{ bg: "gray.100" }} pr={4}>
              <Box flex={1} textAlign="left" fontSize="lg" pl={4}>
                🧰 Species Fields Customisation
              </Box>
            </AccordionItemTrigger>
          </h2>
          <AccordionItemContent p={4}>
            <SpeciesHierarchyForm
              onSubmit={handleSpeciesFieldsSubmit}
              langId={langId}
              userGroupId={userGroupId}
            />
          </AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </div>
  );
}
