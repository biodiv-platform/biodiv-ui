import { AtSignIcon, CheckCircleIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, Button, Circle, Flex, Heading, Icon, Spinner, Text } from "@chakra-ui/react";
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

const steps = [
  { label: "Basic Details", content: "Enter personal details", icon: EditIcon },
  { label: "Group Coverage", content: "Select preferences", icon: GlobeIcon },
  { label: "User Roles", content: "Review & Submit", icon: UserCheckIcon },
  { label: "Homepage Customisation", content: "Review & Submit", icon: HomeIcon },
  { label: "Main Gallery Management", content: "Review & Submit", icon: ImageIcon },
  // { label: "Mini Gallery Management", content: "Review & Submit", icon: EditIcon },
  { label: "Custom Fields Customisation", content: "Review & Submit", icon: ListIcon },
  { label: "Group Rules Customisation", content: "Review & Submit", icon: CheckCircleIcon },
  { label: "Observation Display", content: "Review & Submit", icon: ViewIcon },
  { label: "Species Fields Customisation", content: "Review & Submit", icon: AtSignIcon }
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
  traits
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
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;

            const bgColor = isActive ? "blue.600" : "white";

            const borderColor = isActive ? "blue.600" : "gray.300";

            const textColor = isActive ? "blue.600" : "black.500";

            const iconColor = isActive ? "white" : "gray.400";

            return (
              <Flex key={index} direction="column" align="center" flex="1">
                <Circle
                  as={Button}
                  onClick={() => setCurrentStep(index)}
                  size="48px"
                  border="2px solid"
                  borderColor={borderColor}
                  bg={bgColor}
                  color={iconColor}
                  mb={2}
                  _hover={{ borderColor: "blue.400", bgColor: "blue.400", color: "white" }}
                >
                  {<Icon as={StepIcon} boxSize={4} />}
                </Circle>
                <Text fontSize="sm" fontWeight="medium" textAlign="center" color={textColor}>
                  {step.label}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Box>
      <Box p={6} rounded="lg" border="1px solid" borderColor="gray.200" boxShadow="sm" mb={4}>
        <Heading as="h2" fontSize={22} fontWeight="bold" color="gray.900" mb={2}>
          {steps[currentStep].label}
        </Heading>
        {groupInfo ? (
          <UserGroupEditForm
            groupInfo={groupInfo}
            userGroupId={userGroupId}
            habitats={habitats}
            speciesGroups={speciesGroups}
            currentStep={currentStep}
          />
        ) : (
          <Spinner mb={10} />
        )}
        {currentStep == 2 && (
          <GroupAdministratorsEditForm
            userGroupId={userGroupId}
            founders={founders}
            moderators={moderators}
          />
        )}
        {(currentStep == 3 || currentStep == 4) && (
          <GroupHomePageCustomization
            userGroupId={userGroupId}
            homePageDetails={homePageDetails}
            currentStep={currentStep}
          />
        )}
        {isAdmin ? (
          <div>
            {currentStep == 5 && (
              <GroupCustomField
                allCustomField={allCustomField}
                userGroupId={userGroupId}
                groupCustomField={customFieldList}
              />
            )}
            {currentStep == 6 && (
              <GroupRules rules={groupRules} userGroupId={userGroupId} traits={traits} />
            )}
          </div>
        ) : currentStep == 5 || currentStep == 6 ? (
          <ContactAdmin />
        ) : (
          <Box></Box>
        )}
        {(isAdmin || isFounder) && currentStep == 7 && (
          <ObservationCustomizations userGroupId={userGroupId} mediaToggle={mediaToggle} />
        )}
        {currentStep == 8 && (
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
