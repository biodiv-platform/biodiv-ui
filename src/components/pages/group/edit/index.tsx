import {
  Box,
  Heading,
  Spinner
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import GroupCustomField from "@components/pages/group/common/custom-field";
import GlobeIcon from "@icons/globe";
import HomeIcon from "@icons/home";
import ImageIcon from "@icons/image";
import ListIcon from "@icons/list";
import UserCheckIcon from "@icons/user-check";
import { Role } from "@interfaces/custom";
import { axUpdateSpeciesFieldsMapping } from "@services/usergroup.service";
import { getParsedUser, hasAccess } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuAtSign, LuCircleCheck, LuView } from "react-icons/lu";

import EditIcon from "@/icons/edit";

import Wizard from "../../common/wizard";
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
  languagesList;
}

const steps = [
  { label: "Basic Details", translation: "group:basic_details", icon: EditIcon },
  { label: "Group Coverage", translation: "group:group_coverage", icon: GlobeIcon },
  { label: "User Roles", translation: "group:admin.title", icon: UserCheckIcon },
  {
    label: "Homepage Components",
    translation: "group:homepage_customization.title",
    icon: HomeIcon
  },
  {
    label: "Main Gallery",
    translation: "group:homepage_customization.gallery_setup.title",
    icon: ImageIcon
  },
  { label: "Custom Fields", translation: "group:custom_field.title", icon: ListIcon },
  { label: "Group Rules", translation: "group:rules.title", icon: LuCircleCheck },
  { label: "Observation Display", translation: "group:observation_display", icon: LuView },
  { label: "Species Fields", translation: "group:species_fields.title", icon: LuAtSign }
];

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
  traits,
  languagesList
}: GroupEditPageProps) {
  const { t } = useTranslation();
  const isAdmin = hasAccess([Role.Admin]);
  const isFounder = founders.some((founder) => founder.value === getParsedUser().id);
  const [currentStep, setCurrentStep] = useState(0);

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
      <Wizard steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
      <Box p={6} rounded="lg" border="1px solid" borderColor="gray.200" boxShadow="sm" mb={4}>
        <Heading as="h2" fontSize={22} fontWeight="bold" color="gray.900" mb={2}>
          {t(steps[currentStep].translation)}
        </Heading>
        {groupInfo ? (
          <UserGroupEditForm
            groupInfo={groupInfo}
            userGroupId={userGroupId}
            habitats={habitats}
            speciesGroups={speciesGroups}
            currentStep={steps[currentStep].translation}
            languages={languagesList}
            isAdmin = {isAdmin}
          />
        ) : (
          <Spinner mb={10} />
        )}
        {steps[currentStep].translation == "group:admin.title" && (
          <GroupAdministratorsEditForm
            userGroupId={userGroupId}
            founders={founders}
            moderators={moderators}
            allowUsersToJoin = {groupInfo}
          />
        )}
        {(steps[currentStep].translation == "group:homepage_customization.title" ||
          steps[currentStep].translation == "group:homepage_customization.gallery_setup.title") && (
          <Box mt={4}>
            <GroupHomePageCustomization
              userGroupId={userGroupId}
              homePageDetails={homePageDetails}
              currentStep={steps[currentStep].translation}
              languages={languagesList}
            />
          </Box>
        )}
        {isAdmin ? (
          <div>
            {steps[currentStep].translation == "group:custom_field.title" && (
              <GroupCustomField
                allCustomField={allCustomField}
                userGroupId={userGroupId}
                groupCustomField={customFieldList}
              />
            )}
            {steps[currentStep].translation == "group:rules.title" && (
              <GroupRules rules={groupRules} userGroupId={userGroupId} traits={traits} />
            )}
          </div>
        ) : steps[currentStep].translation == "group:custom_field.title" ||
          steps[currentStep].translation == "group:rules.title" ? (
          <ContactAdmin />
        ) : (
          <Box></Box>
        )}
        {(isAdmin || isFounder) &&
          steps[currentStep].translation == "group:observation_display" && (
            <ObservationCustomizations userGroupId={userGroupId} mediaToggle={mediaToggle} />
          )}
        {steps[currentStep].translation == "group:species_fields.title" && (
          <SpeciesHierarchyForm
            onSubmit={handleSpeciesFieldsSubmit}
            langId={langId}
            userGroupId={userGroupId}
          />
        )}
      </Box>
    </div>
  );
}
