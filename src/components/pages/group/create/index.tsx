import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { CheckboxField } from "@components/form/checkbox";
import { RichTextareaField } from "@components/form/rich-textarea";
import { SwitchField } from "@components/form/switch";
import { TextBoxField } from "@components/form/text";
import { yupResolver } from "@hookform/resolvers/yup";
import useGlobalState from "@hooks/use-global-state";
import GlobeIcon from "@icons/globe";
import HomeIcon from "@icons/home";
import ImageIcon from "@icons/image";
import ListIcon from "@icons/list";
import UserCheckIcon from "@icons/user-check";
import { Role } from "@interfaces/custom";
import { GallerySlider } from "@interfaces/utility";
import {
  axAddCustomField,
  axAddExsistingCustomField,
  axAddUserGroupRule,
  axUpdateGroupHomePageDetails,
  axUpdateSpeciesFieldsMapping,
  axUserGroupCreate
} from "@services/usergroup.service";
import { MEDIA_TOGGLE } from "@static/constants";
import { hasAccess } from "@utils/auth";
import dayjs, { dateToUTC, parseDate } from "@utils/date";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  LuAtSign,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuView
} from "react-icons/lu";
import * as Yup from "yup";

import EditIcon from "@/icons/edit";

import AdminInviteField from "../common/admin-invite-field";
import AreaDrawField from "../common/area-draw-field";
import AddCustomFieldForm from "../common/custom-field/custom-field-form";
import CustomFieldTable from "../common/custom-field/custom-field-table";
import IconCheckboxField from "../common/icon-checkbox-field";
import ImageUploaderField from "../common/image-uploader-field";
import { STATIC_GROUP_PAYLOAD } from "../common/static";
import ContactAdmin from "../edit/contact-admin";
import AddGroupRulesForm from "../edit/group-rules/group-rules-form";
import GroupRulesTable from "../edit/group-rules/group-rules-table";
import GallerySetupFrom from "../edit/homepage-customization/gallery-setup/gallery-setup-form";
import GallerySetupTable from "../edit/homepage-customization/gallery-setup/gallery-setup-tabel";
import SpeciesHierarchyForm from "../edit/species-hierarchy-form";

interface GroupCreatePageComponentProps {
  speciesGroups;
  habitats;
  allCustomField;
  traits;
  languages;
}
interface WithId {
  customFieldId: number;
  displayOrder: number;
  isMandatory: boolean;
  allowedParticipation: any;
}

interface WithoutId {
  allowedParticipation: any;
  dataType?: string;
  displayOrder: number;
  fieldType?: string;
  isMandatory: boolean;
  name?: string;
  notes?: string;
  units?: string;
  userGroupId: string;
  values?: any;
}
export const transformMemberPayload = (membersList) => {
  return (membersList || [])?.reduce(
    ({ idsList, emailList }, item: any) => {
      return item["__isNew__"]
        ? { idsList, emailList: [...emailList, item.value] }
        : { emailList, idsList: [...idsList, item.value] };
    },
    { idsList: [], emailList: [] }
  );
};

const steps = [
  { label: "Basic Details", translation: "Enter personal details", icon: EditIcon },
  { label: "Group Coverage", translation: "Select preferences", icon: GlobeIcon },
  { label: "User Roles", translation: "Review & Submit", icon: UserCheckIcon },
  { label: "Homepage Components", translation: "Review & Submit", icon: HomeIcon },
  { label: "Main Gallery", translation: "Review & Submit", icon: ImageIcon },
  // { label: "Mini Gallery Management", content: "Review & Submit", icon: EditIcon },
  { label: "Custom Fields", translation: "group:custom_field.title", icon: ListIcon },
  { label: "Group Rules", translation: "Review & Submit", icon: LuCircleCheck },
  { label: "Observation Display", translation: "Review & Submit", icon: LuView },
  { label: "Species Fields", translation: "Review & Submit", icon: LuAtSign }
];

export default function CreateGroupPageComponent({
  speciesGroups,
  habitats,
  allCustomField,
  traits,
  languages
}: GroupCreatePageComponentProps) {
  const { t } = useTranslation();
  const router = useLocalRouter();
  const { languageId } = useGlobalState();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreate, setIsCreate] = useState(false);
  const [, setIsEdit] = useState(false);
  const [galleryList, setGalleryList] = useState<GallerySlider[]>([]);
  const [, setEditGalleryData] = useState([]);
  const [customFields, setCustomFields] = useState<
    {
      customFields?: { id?: number };
      isMandatory: boolean;
      allowedParticipation: any;
      dataType?: string;
      fieldType?: string;
      name?: string;
      notes?: string;
      units?: string;
      cfValues?: any;
    }[]
  >([]);
  const [customFieldList] = useState(allCustomField);
  const [, setEditCustomFieldData] = useState([]);
  const [groupRules, setGroupRules] = useState<
    {
      id?: number;
      name: string;
      value: any;
    }[]
  >([]);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  const hForm = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string()
          .required()
          .matches(/^[^/]*$/, "Name cannot contain '/'"),
        speciesGroup: Yup.array().required(),
        habitatId: Yup.array().required(),
        allowUserToJoin: Yup.boolean().required(),
        spacialCoverage: Yup.object().shape({
          ne: Yup.array().required(),
          se: Yup.array().required()
        }),
        icon: Yup.string().nullable(),
        founder: Yup.array().nullable(),
        moderator: Yup.array().nullable(),
        showGallery: Yup.boolean(),
        showStats: Yup.boolean(),
        showDesc: Yup.boolean(),
        showRecentObservation: Yup.boolean(),
        showGridMap: Yup.boolean(),
        showPartners: Yup.boolean(),
        mediaToggle: Yup.boolean()
      })
    ),
    defaultValues: {
      allowUserToJoin: true,
      showGallery: true,
      showStats: true,
      showRecentObservation: true,
      showGridMap: true,
      showPartners: true,
      showDesc: true,
      mediaToggle: true
    }
  });
  const isAdmin = hasAccess([Role.Admin]);

  const handleFormSubmit = async () => {
    const { spacialCoverage, founder, moderator, mediaToggle, ...otherValues } = hForm.getValues();

    const spacialCoverageBounds = {
      neLatitude: spacialCoverage?.ne?.[1],
      neLongitude: spacialCoverage?.ne?.[0],
      swLatitude: spacialCoverage?.se?.[1],
      swLongitude: spacialCoverage?.se?.[0]
    };

    const founderFormat = transformMemberPayload(founder);
    const moderatorFormat = transformMemberPayload(moderator);
    const invitationData = {
      userGroupId: 0,
      founderIds: founderFormat.idsList,
      moderatorsIds: moderatorFormat.idsList,
      founderEmail: founderFormat.emailList,
      moderatorsEmail: moderatorFormat.emailList
    };
    const media = mediaToggle == true ? MEDIA_TOGGLE.WITH_MEDIA : MEDIA_TOGGLE.ALL;

    const payload = {
      languageId: languageId,
      mediaToggle: media,
      ...STATIC_GROUP_PAYLOAD,
      ...otherValues,
      ...spacialCoverageBounds,
      invitationData
    };

    const { success, data } = await axUserGroupCreate(payload);
    if (success) {
      notification(t("group:create.success"), NotificationType.Success);
      const {
        showDesc,
        showGallery,
        showGridMap,
        showPartners,
        showRecentObservation,
        showStats,
        description
      } = hForm.getValues();
      const gallerypaylpad = {
        gallerySlider: galleryList.reduce<Record<number, any[]>[]>((acc, item, index) => {
          const sliderId = item[0].split("|")[0];
          const languageMap = item[1] as Record<number, any[]>;

          if (sliderId === "null") {
            for (const langId in languageMap) {
              languageMap[langId] = languageMap[langId].map((entry) => ({
                ...entry,
                ugId: data.id,
                displayOrder: index
              }));
            }
            acc.push(languageMap);
          }

          return acc;
        }, []),
        showDesc,
        showGallery,
        showGridMap,
        showPartners,
        showRecentObservation,
        showStats,
        description
      };
      const { success: group_success } = await axUpdateGroupHomePageDetails(
        data.id,
        gallerypaylpad
      );
      if (group_success) {
        notification(t("group:homepage_customization.success"), NotificationType.Success);
      } else {
        notification("Unable to add gallery slides", NotificationType.Error);
      }
      const [customFieldsWithId, customFieldsWithoutId] = customFields.reduce<
        [WithId[], WithoutId[]]
      >(
        ([withId, withoutId], item, index) => {
          if (item.customFields?.id) {
            withId.push({
              customFieldId: item.customFields.id,
              displayOrder: index,
              isMandatory: item.isMandatory,
              allowedParticipation: item.allowedParticipation
            });
          } else {
            withoutId.push({
              allowedParticipation: item.allowedParticipation,
              dataType: item.dataType,
              displayOrder: index,
              fieldType: item.fieldType,
              isMandatory: item.isMandatory,
              name: item.name,
              notes: item.notes,
              units: item.units,
              userGroupId: data.id,
              values: item.cfValues
            });
          }
          return [withId, withoutId];
        },
        [[], []] as [WithId[], WithoutId[]]
      );
      if (customFieldsWithId.length > 0) {
        const { success: custom_success } = await axAddExsistingCustomField(
          data.id,
          customFieldsWithId
        );
        if (custom_success) {
          notification("Successfully updated customFields", NotificationType.Success);
        }
      }
      if (customFieldsWithoutId.length > 0) {
        const { success: custom_success } = await axAddCustomField(customFieldsWithoutId);
        if (custom_success) {
          notification("Successfully updated customFields", NotificationType.Success);
        }
      }
      const [
        taxonomicIdList,
        createdOnDateList,
        observedOnDateList,
        traitList,
        spartialDataList,
        hasUserRule
      ] = groupRules.reduce<
        [
          number[],
          { fromDate: string; toDate: string }[],
          { fromDate: string; toDate: string }[],
          Record<string, string>[],
          string[],
          boolean
        ]
      >(
        ([taxon, createdOn, observedOn, trait, spatial, user], item) => {
          if (item.name == "taxonomicRule") {
            taxon.push(item.value);
          } else if (item.name == "traitRule") {
            const traitId = item.value.split(":")[0].split("|")[0];
            item.value
              .split(":")[1]
              .split(",")
              .map((v) => trait.push({ [traitId]: v.split("|")[0] }));
          } else if (item.name == "spatialRule") {
            spatial.push(item.value);
          } else if (item.name == "userRule") {
            user = true;
          } else {
            if (item.name == "createdOnDateRule") {
              createdOn.push({
                fromDate: dateToUTC(item.value.split(" to ")[0]).format(),
                toDate: dateToUTC(
                  dayjs(parseDate(item.value.split(" to ")[1])).endOf("day")
                ).format()
              });
            } else {
              observedOn.push({
                fromDate: dateToUTC(item.value.split(" to ")[0]).format(),
                toDate: dateToUTC(
                  dayjs(parseDate(item.value.split(" to ")[1])).endOf("day")
                ).format()
              });
            }
          }
          return [taxon, createdOn, observedOn, trait, spatial, user];
        },
        [[], [], [], [], [], false]
      );
      const { success: rules } = await axAddUserGroupRule(data.id, {
        taxonomicIdList: taxonomicIdList,
        createdOnDateList: createdOnDateList,
        observedOnDateList: observedOnDateList,
        traitList: traitList,
        spartialDataList: spartialDataList,
        hasUserRule: hasUserRule
      });
      if (rules) {
        notification("Successfully updated group rules", NotificationType.Success);
      }
      const { success: speciesField } = await axUpdateSpeciesFieldsMapping(data.id, selectedNodes);
      if (speciesField) {
        notification("Successfully updated species field mapping", NotificationType.Success);
      }
      router.push(`/group/${data.name.replace(/\s+/g, "_")}/show`, false, {}, true);
    } else {
      notification(t("group:create.error"));
    }
  };

  const handleNext = async () => {
    let isValid = false;
    if (currentStep === 5 || currentStep === 6 || currentStep === 7) {
      isValid = true;
    }
    if (currentStep === 0) {
      isValid = await hForm.trigger(["name"]);
    } else if (currentStep === 1) {
      isValid = await hForm.trigger(["speciesGroup", "habitatId", "spacialCoverage"]);
    } else if (currentStep === 2) {
      isValid = await hForm.trigger(["allowUserToJoin", "founder", "moderator"]);
    } else if (currentStep === 3) {
      isValid = true;
    } else if (currentStep === 4) {
      isValid = galleryList.length > 0;
    }
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="container mt">
      <PageHeading>👥 {t("group:create.title")}</PageHeading>
      <Box mb={8}>
        <Grid
          templateColumns={`repeat(${steps.length * 2 - 1}, 1fr)`} // icon, arrow, icon, arrow...
          gap={0}
          alignItems="center"
        >
          {/* === ICONS AND ARROWS === */}
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            const bgColor = isActive ? "blue.600" : isCompleted ? "green.500" : "white";
            const borderColor = isActive ? "blue.600" : isCompleted ? "green.500" : "gray.300";
            const iconColor = isActive || isCompleted ? "white" : "gray.400";

            return (
              <>
                {/* Step Icon */}
                <GridItem key={`icon-${index}`} colSpan={1}>
                  <Flex justify="center" align="center" w="100%">
                    <Circle
                      as={Button}
                      size="48px"
                      border="2px solid"
                      borderColor={borderColor}
                      bg={bgColor}
                      color={iconColor}
                      _hover={!isActive && !isCompleted ? { borderColor: "gray.400" } : {}}
                    >
                      {isCompleted ? <LuCheck size={4} /> : <Icon as={StepIcon} boxSize={4} />}
                    </Circle>
                  </Flex>
                </GridItem>

                {/* Arrow (skip for last item) */}
                {index !== steps.length - 1 && (
                  <GridItem key={`arrow-${index}`} colSpan={1} textAlign="center">
                    <Icon boxSize={6}>
                      <LuChevronRight color="gray.400" />
                    </Icon>
                  </GridItem>
                )}
              </>
            );
          })}

          {/* === LABELS === */}
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const textColor = isActive ? "blue.600" : isCompleted ? "green.600" : "gray.600";

            return (
              <>
                <GridItem key={`label-${index}`} colSpan={1} mt={2} textAlign="center">
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {step.label}
                  </Text>
                </GridItem>

                {/* Skip empty GridItem after last label */}
                {index !== steps.length - 1 && <GridItem key={`label-gap-${index}`} colSpan={1} />}
              </>
            );
          })}
        </Grid>
      </Box>
      <Box p={6} rounded="lg" border="1px solid" borderColor="gray.200" boxShadow="sm" mb={4}>
        <Heading as="h2" fontSize={22} fontWeight="bold" color="gray.900" mb={2}>
          {steps[currentStep].label}
        </Heading>
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
            {currentStep == 0 && (
              <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ md: 4 }}>
                <Box gridColumn="1/4">
                  <TextBoxField
                    name="name"
                    isRequired={true}
                    label={t("group:name")}
                    hint="Kindly provide the name of your group. Keep the name concise, as longer names may not be properly formatted in all locations, and the group URL will be generated based on this."
                  />
                  <RichTextareaField
                    name="description"
                    label={t("form:description.title")}
                    hint="Please provide a concise overview of the aims and objectives of the group."
                  />
                </Box>
                <ImageUploaderField
                  label="Logo"
                  name="icon"
                  hint="Upload a logo for the group. It should preferably be cropped to a square."
                />
              </SimpleGrid>
            )}
            {currentStep == 1 && (
              <>
                <IconCheckboxField
                  name="speciesGroup"
                  label={t("common:species_coverage")}
                  options={speciesGroups}
                  type="species"
                  isRequired={true}
                  hint="Select the species groups that this group will cover. If none of the other groups are available, select Other."
                />
                <IconCheckboxField
                  name="habitatId"
                  label={t("common:habitats_covered")}
                  options={habitats}
                  type="habitat"
                  isRequired={true}
                  hint="Select which habitats will be included in this group. If none of the provided habitats are available, select Other."
                />
                <AreaDrawField
                  label={t("group:spatial_coverge")}
                  name={"spacialCoverage"}
                  mb={8}
                  isRequired={true}
                  hint="Using the tools on the map, draw a rough polygon around the areas this group covers."
                />
              </>
            )}

            {currentStep == 2 && (
              <>
                <CheckboxField
                  name="allowUserToJoin"
                  label={t("group:join_without_invitation")}
                  hint="Allow users to join the group as members without invitation? Closed groups will need moderators to approve requests before joining."
                />
                <AdminInviteField
                  name="founder"
                  label={t("group:invite_founders")}
                  hint="Founders will be able to edit the group and change all group settings."
                />
                <AdminInviteField
                  name="moderator"
                  label={t("group:invite_moderators")}
                  hint="Moderators cannot edit the group settings but will have additional privileges such as posting content in bulk and featuring objects."
                />
              </>
            )}

            {currentStep == 3 && (
              <>
                <Box className="fade">
                  <Box color="gray.600">
                    Switch on or off homepage components such as descriptions, content stats, etc.
                  </Box>
                  <Box width={["100%", 350]} justifyContent="space-between" mt={4}>
                    <SwitchField
                      name="showGallery"
                      label={t("group:homepage_customization.gallery")}
                    />
                    <SwitchField
                      name="showStats"
                      label={t("group:homepage_customization.module_stats")}
                    />
                    <SwitchField
                      name="showRecentObservation"
                      label={t("group:homepage_customization.recent_observation")}
                    />
                    <SwitchField
                      name="showGridMap"
                      label={t("group:homepage_customization.observation_map")}
                    />
                    <SwitchField
                      name="showDesc"
                      label={t("group:homepage_customization.show_desc")}
                    />
                  </Box>
                </Box>
              </>
            )}
            {currentStep == 7 && (
              <SwitchField name="mediaToggle" label={t("group:observations_having_media")} />
            )}
          </form>
        </FormProvider>
        {currentStep == 4 && (
          <>
            <Box color="gray.600">
              Upload images to the homepage gallery or use observations as gallery images.
            </Box>
            {isCreate ? (
              <GallerySetupFrom
                setIsCreate={setIsCreate}
                galleryList={galleryList}
                setGalleryList={setGalleryList}
                languages={languages}
              />
            ) : (
              <GallerySetupTable
                userGroupId={null}
                setIsCreate={setIsCreate}
                setGalleryList={setGalleryList}
                galleryList={galleryList}
                setIsEdit={setIsEdit}
                setEditGalleryData={setEditGalleryData}
              />
            )}
          </>
        )}
        {currentStep == 5 &&
          (isAdmin ? (
            <Box p={3}>
              <Box color="gray.600">
                Additional queries/fields within the observation upload form for your group.
              </Box>
              {isCreate ? (
                <AddCustomFieldForm
                  customFields={customFields}
                  allCustomFields={customFieldList}
                  setCustomFields={setCustomFields}
                  setIsCreate={setIsCreate}
                />
              ) : (
                <CustomFieldTable
                  userGroupId={null}
                  customFields={customFields}
                  setCustomFields={setCustomFields}
                  setIsCreate={setIsCreate}
                  setIsEdit={setIsEdit}
                  setEditCustomFieldData={setEditCustomFieldData}
                />
              )}
            </Box>
          ) : (
            <ContactAdmin />
          ))}
        {currentStep == 6 &&
          (isAdmin ? (
            <Box p={3}>
              <Box color="gray.600">
                Automated rules that will allow posting of qualifying observations to the grou
              </Box>
              {isCreate ? (
                <AddGroupRulesForm
                  groupRules={groupRules}
                  setGroupRules={setGroupRules}
                  setIsCreate={setIsCreate}
                  traits={traits}
                />
              ) : (
                <GroupRulesTable
                  userGroupId={null}
                  groupRules={groupRules}
                  setGroupRules={setGroupRules}
                  setIsCreate={setIsCreate}
                />
              )}
            </Box>
          ) : (
            <ContactAdmin />
          ))}
        {currentStep == 8 && (
          <SpeciesHierarchyForm
            onSubmit={(payload) => setSelectedNodes(payload)}
            langId={languageId}
            userGroupId={null}
          />
        )}
      </Box>
      {!isCreate && (
        <Flex justify="space-between" align="center" mb={4}>
          <Button
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
            px={6}
            py={3}
            borderRadius="lg"
            transition="all 0.2s"
            bg={currentStep === 0 ? "gray.100" : "blue.600"}
            color={currentStep === 0 ? "gray.400" : "white"}
            _hover={currentStep === 0 ? {} : { bg: "gray.200" }}
            cursor={currentStep === 0 ? "not-allowed" : "pointer"}
          >
            <Icon as={LuChevronLeft} boxSize={5} />
            Previous
          </Button>

          <Text fontSize="sm" color="gray.500">
            Step {currentStep + 1} of {steps.length}
          </Text>

          <Button
            onClick={currentStep === steps.length - 1 ? handleFormSubmit : handleNext}
            px={6}
            py={3}
            borderRadius="lg"
            transition="all 0.2s"
            bg={currentStep === steps.length - 1 ? "green.600" : "blue.600"}
            color="white"
            _hover={{
              bg: currentStep === steps.length - 1 ? "green.700" : "blue.700"
            }}
          >
            {currentStep === steps.length - 1 ? "Create Group" : "Next"}
            <LuChevronRight />
          </Button>
        </Flex>
      )}
    </div>
  );
}
