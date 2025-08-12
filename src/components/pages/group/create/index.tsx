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
  axCreateMiniGroupGallery,
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

import MiniGallery from "../../admin/homegallery/mini-gallery";
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
  {
    label: "Mini Gallery",
    translation: "group:homepage_customization.mini_gallery_setup.title",
    icon: ImageIcon
  },
  { label: "Custom Fields", translation: "group:custom_field.title", icon: ListIcon },
  { label: "Group Rules", translation: "group:rules.title", icon: LuCircleCheck },
  { label: "Observation Display", translation: "group:observation_display", icon: LuView },
  { label: "Species Fields", translation: "group:species_fields.title", icon: LuAtSign }
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
  const [miniGalleryList, setMiniGalleryList] = useState([]);
  const [miniGallerySliderList, setMiniGallerySliderList] = useState([]);
  const [, setEditGalleryData] = useState([]);
  const [customFields, setCustomFields] = useState<
    {
      customFields?: {
        id?: number;
        dataType: string;
        fieldType?: string;
        name?: string;
        notes?: string;
        units?: string;
      };
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
      taxonId: number;
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
        spacialCoverage: Yup.string().required(),
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
      mediaToggle: true,
      spacialCoverage: null
    }
  });
  const isAdmin = hasAccess([Role.Admin]);

  const handleFormSubmit = async () => {
    const { spacialCoverage, founder, moderator, mediaToggle, ...otherValues } = hForm.getValues();

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
      spatialData: spacialCoverage,
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
      let miniGallery_overall_success = true;
      for (const miniGallery of miniGalleryList) {
        const { success: miniGallery_success } = await axCreateMiniGroupGallery(
          miniGallery[1],
          data.id
        );
        miniGallery_overall_success = miniGallery_success;

        if (!miniGallery_success) {
          break;
        }
      }
      if (miniGallery_overall_success) {
        notification("Successfully created miniGalleries", NotificationType.Success);
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
              dataType: item.customFields?.dataType ?? "",
              displayOrder: index,
              fieldType: item.customFields?.fieldType ?? "",
              isMandatory: item.isMandatory,
              name: item.customFields?.name ?? "",
              notes: item.customFields?.notes ?? "",
              units: item.customFields?.units ?? "",
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
        let custom_overall_success = true;

        for (const custom of customFieldsWithoutId) {
          const { success: custom_success } = await axAddCustomField(custom);
          custom_overall_success = custom_success;

          if (!custom_success) {
            break;
          }
        }

        if (custom_overall_success) {
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
            taxon.push(item.taxonId);
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
    if (
      steps[currentStep].translation === "group:homepage_customization.mini_gallery_setup.title" ||
      steps[currentStep].translation === "group:custom_field.title" ||
      steps[currentStep].translation === "group:rules.title" ||
      steps[currentStep].translation === "group:rules.title"
    ) {
      isValid = true;
    }
    if (steps[currentStep].translation === "group:basic_details") {
      isValid = await hForm.trigger(["name"]);
    } else if (steps[currentStep].translation === "group:group_coverage") {
      isValid = await hForm.trigger(["speciesGroup", "habitatId", "spacialCoverage"]);
    } else if (steps[currentStep].translation === "group:admin.title") {
      isValid = await hForm.trigger(["allowUserToJoin", "founder", "moderator"]);
    } else if (steps[currentStep].translation === "group:homepage_customization.title") {
      isValid = true;
    } else if (
      steps[currentStep].translation === "group:homepage_customization.gallery_setup.title"
    ) {
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
          overflow={"auto"}
        >
          {/* === ICONS AND ARROWS === */}
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            const bgColor = isActive ? "blue.600" : isCompleted ? "green" : "white";
            const borderColor = isActive ? "blue.600" : isCompleted ? "green" : "gray.300";
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
                    {t(step.translation)}
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
          {t(steps[currentStep].translation)}
        </Heading>
        <FormProvider {...hForm}>
          <form onSubmit={hForm.handleSubmit(handleFormSubmit)}>
            {steps[currentStep].translation == "group:basic_details" && (
              <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ md: 4 }}>
                <Box gridColumn="1/4">
                  <TextBoxField
                    name="name"
                    isRequired={true}
                    label={t("group:name")}
                    hint={t("group:name_hint")}
                  />
                  <RichTextareaField
                    name="description"
                    label={t("form:description.title")}
                    hint={t("form:description.hint")}
                  />
                </Box>
                <ImageUploaderField label="Logo" name="icon" hint={t("group:logo_hint")} />
              </SimpleGrid>
            )}
            {steps[currentStep].translation == "group:group_coverage" && (
              <>
                <IconCheckboxField
                  name="speciesGroup"
                  label={t("common:species_coverage")}
                  options={speciesGroups}
                  type="species"
                  isRequired={true}
                  hint={t("common:species_coverage_hint")}
                />
                <IconCheckboxField
                  name="habitatId"
                  label={t("common:habitats_covered")}
                  options={habitats}
                  type="habitat"
                  isRequired={true}
                  hint={t("common:habitats_covered_hint")}
                />
                <AreaDrawField
                  label={t("group:spatial_coverge")}
                  name={"spacialCoverage"}
                  mb={8}
                  isRequired={true}
                  hint={t("group:spatial_coverge_hint")}
                />
              </>
            )}

            {steps[currentStep].translation == "group:admin.title" && (
              <>
                <CheckboxField
                  name="allowUserToJoin"
                  label={t("group:join_without_invitation")}
                  hint={t("group:join_without_invitation_hint")}
                />
                <AdminInviteField
                  name="founder"
                  label={t("group:invite_founders")}
                  hint={t("group:invite_founders_hint")}
                />
                <AdminInviteField
                  name="moderator"
                  label={t("group:invite_moderators")}
                  hint={t("group:invite_moderators_hint")}
                />
              </>
            )}

            {steps[currentStep].translation == "group:homepage_customization.title" && (
              <>
                <Box className="fade">
                  <Box color="gray.600">{t("group:homepage_customization.hint")}</Box>
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
            {steps[currentStep].translation == "group:observation_display" && (
              <SwitchField name="mediaToggle" label={t("group:observations_having_media")} />
            )}
          </form>
        </FormProvider>
        {steps[currentStep].translation == "group:homepage_customization.gallery_setup.title" && (
          <>
            <Box color="gray.600">{t("group:homepage_customization.gallery_hint")}</Box>
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
        {steps[currentStep].translation ==
          "group:homepage_customization.mini_gallery_setup.title" && (
          <MiniGallery
            miniGallery={miniGalleryList}
            setMiniGallery={setMiniGalleryList}
            languages={languages}
            sliderList={miniGallerySliderList}
            setSliderList={setMiniGallerySliderList}
            handleFormSubmit={hForm.handleSubmit(handleFormSubmit)}
            mode={"create"}
          />
        )}
        {steps[currentStep].translation == "group:custom_field.title" &&
          (isAdmin ? (
            <Box p={3}>
              <Box color="gray.600">{t("group:custom_field_hint")}</Box>
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
        {steps[currentStep].translation == "group:rules.title" &&
          (isAdmin ? (
            <Box p={3}>
              <Box color="gray.600">{t("group:rules.hint")}</Box>
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
        {steps[currentStep].translation == "group:species_fields.title" && (
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
            {t("group:create.previous")}
          </Button>

          <Text fontSize="sm" color="gray.500">
            {t("group:create.step")} {currentStep + 1} of {steps.length}
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
            {currentStep === steps.length - 1 ? t("group:create.title") : t("group:create.next")}
            <LuChevronRight />
          </Button>
        </Flex>
      )}
    </div>
  );
}
