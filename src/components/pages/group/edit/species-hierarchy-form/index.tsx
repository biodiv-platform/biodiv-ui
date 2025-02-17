import { Box, Button, Checkbox } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { axGetAllFieldsMeta } from "@services/species.service";
import { axGetSpeciesFieldsMapping, axUpdateSpeciesFieldContributors } from "@services/usergroup.service";
import notification, { NotificationType } from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import AdminInviteField from "../../common/admin-invite-field";

interface SelectedNode {
  id: number;
  header: string;
  path: string;
  label: string;
}

interface SpeciesHierarchyProps {
  onSubmit: (selectedNodes: SelectedNode[]) => void | Promise<void>;
  initialData?: any[];
  langId: number;
  userGroupId: string;
}

const onMemberRemoved = async ({ value }, initialMembers) => {
  // if (initialMembers.includes(value)) {
  //   return await axUserGroupRemoveAdminMembers(userGroupId, value);
  // }

  // return { success: true };
  console.log("initialMembers", initialMembers);
  console.log("remove member", value);
};

// Helper function to get all leaf nodes recursively
const getAllLeafNodes = (items: any[]): SelectedNode[] => {
  const leafNodes: SelectedNode[] = [];

  const traverse = (item: any) => {
    const { parentField, childField = [], childFields = [] } = item;

    // Check if it's a leaf node
    if (!childField?.length && !childFields?.length && parentField) {
      leafNodes.push({
        id: parentField.id,
        header: parentField.header,
        path: parentField.path,
        label: parentField.label
      });
    }

    // Traverse child fields
    childField?.forEach(traverse);

    // Check child fields array
    childFields?.forEach((subItem) => {
      leafNodes.push({
        id: subItem.id,
        header: subItem.header,
        path: subItem.path,
        label: subItem.label
      });
    });
  };

  items.forEach(traverse);
  return leafNodes;
};

const TreeItem = React.memo(
  ({
    item,
    level,
    onSelect,
    selectedNodes = []
  }: {
    item: any;
    level: number;
    onSelect: (node: SelectedNode) => void;
    selectedNodes: SelectedNode[];
  }) => {
    const { parentField, childField = [], childFields = [] } = item;

    if (!parentField) {
      return null;
    }

    const isLeaf = !childField?.length && !childFields?.length;
    const nodesList = Array.isArray(selectedNodes) ? selectedNodes : [];
    const isSelected = nodesList.some((node) => node?.id === parentField?.id);

    const handleSelect = () => {
      if (parentField) {
        onSelect({
          id: parentField.id,
          header: parentField.header,
          path: parentField.path,
          label: parentField.label
        });
      }
    };

    return (
      <Box position="relative">
        <Box display="flex" alignItems="center" py={1.5}>
          {level > 0 && (
            <Box display="flex" alignItems="center">
              <Box h="1px" w="6" bg="gray.300" />
              <Box position="absolute" left="6" top="0" bottom="0" w="1px" bg="gray.300" />
            </Box>
          )}

          <Box display="flex" alignItems="center" ml={level > 0 ? 8 : 0} flex={1}>
            <Box display="flex" alignItems="center" flex={1}>
              <Box as="span" color="gray.600" fontSize="sm" mr={2}>
                {parentField.label}:
              </Box>
              <Box as="span" fontWeight="medium" color="gray.900">
                {parentField.header}
              </Box>
            </Box>

            {isLeaf && (
              <Checkbox
                isChecked={isSelected}
                onChange={handleSelect}
                colorScheme="blue"
                size="md"
                mr={2}
              />
            )}
          </Box>
        </Box>

        <Box ml={level > 0 ? 6 : 0}>
          {childField?.map((child: any) => (
            <TreeItem
              key={child.parentField?.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              selectedNodes={selectedNodes}
            />
          ))}

          {childFields?.map((subItem: any) => {
            const isSubItemSelected = nodesList.some((node) => node?.id === subItem?.id);

            return (
              <Box key={subItem.id} position="relative" display="flex" alignItems="center" py={1.5}>
                <Box display="flex" alignItems="center">
                  <Box h="1px" w="6" bg="gray.300" />
                  <Box position="absolute" left="6" top="0" bottom="0" w="1px" bg="gray.300" />
                </Box>

                <Box
                  ml={8}
                  flex={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box flex={1}>
                    <Box as="span" color="gray.600" fontSize="sm" mr={2}>
                      {subItem.label}:
                    </Box>
                    <Box as="span" fontWeight="medium" color="gray.900">
                      {subItem.header}
                    </Box>
                  </Box>

                  <Checkbox
                    isChecked={isSubItemSelected}
                    onChange={() =>
                      onSelect({
                        id: subItem.id,
                        header: subItem.header,
                        path: subItem.path,
                        label: subItem.label
                      })
                    }
                    colorScheme="blue"
                    size="md"
                    mr={2}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
);

export default function SpeciesHierarchyForm({
  onSubmit,
  initialData = [],
  langId,
  userGroupId
}: SpeciesHierarchyProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>(initialData);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [apiStatus, setApiStatus] = useState({ loading: false, error: "" });
  const [selections, setSelections] = useState<SelectedNode[]>([]);

  const methods = useForm<{ selectedNodes: SelectedNode[]; members: any[] }>({
    defaultValues: {
      selectedNodes: [],
      members: []
    }
  });

  const { setValue } = methods;

  const handleSelectAll = () => {
    const allLeafNodes = getAllLeafNodes(data);
    setSelections(allLeafNodes);
    setValue("selectedNodes", allLeafNodes);
  };

  const handleClearAll = () => {
    setSelections([]);
    setValue("selectedNodes", []);
  };

  const handleNodeSelect = (node: SelectedNode) => {
    setSelections((prev) => {
      const currentNodes = [...prev];
      const existingIndex = currentNodes.findIndex((n) => n.id === node.id);

      if (existingIndex >= 0) {
        currentNodes.splice(existingIndex, 1);
      } else {
        currentNodes.push({
          id: node.id,
          header: node.header,
          path: node.path,
          label: node.label
        });
      }

      setValue("selectedNodes", currentNodes);
      return currentNodes;
    });
  };

  useEffect(() => {
    if (hasLoaded) return;

    if (initialData.length > 0) {
      setData(initialData);
      // Pre-select all leaf nodes from initial data
      const allLeafNodes = getAllLeafNodes(initialData);
      setSelections(allLeafNodes);
      setValue("selectedNodes", allLeafNodes);
      setLoading(false);
      setHasLoaded(true);
      return;
    }

    const loadData = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({ langId });
        setData(data);
        const allLeafNodes = getAllLeafNodes(data);
        const { ugSfMappingData } = await axGetSpeciesFieldsMapping(userGroupId);
        const speciesFieldIdSet = new Set(ugSfMappingData.map((item) => item.speciesFieldId));
        const filtered = allLeafNodes.filter((field) => speciesFieldIdSet.has(field.id));

        setSelections(ugSfMappingData.length > 0 ? filtered : allLeafNodes);
        setValue("selectedNodes", ugSfMappingData.length > 0 ? filtered : allLeafNodes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        setHasLoaded(true);
      }
    };

    loadData();
  }, [hasLoaded, initialData, setValue]);

  const handleFormSubmit = async () => {
    if (!selections.length) {
      setApiStatus({ loading: false, error: "Please select at least one item" });
      return;
    }

    try {
      setApiStatus({ loading: true, error: "" });
      await onSubmit(selections);
      setApiStatus({ loading: false, error: "" });
    } catch (err) {
      setApiStatus({
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error occurred"
      });
    }
  };

  const handleContributorsSubmit = async (memberValues) => {
    if (!memberValues?.length) {
      setApiStatus({ loading: false, error: "Please select at least one member" });
      return;
    }

    try {
      setApiStatus({ loading: true, error: "" });
      const payload = memberValues.map(member => ({
        valueType: "contributor",
        valueId: member.value
      }));
      
      const { success, data } = await axUpdateSpeciesFieldContributors(userGroupId, payload);
      
      if (success) {
        notification("Contributors added successfully", NotificationType.Success);
        methods.setValue("members", []); // Clear the selection
      } else {
        notification("Failed to add contributors", NotificationType.Error);
      }
      
      setApiStatus({ loading: false, error: "" });
    } catch (err) {
      setApiStatus({
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error occurred"
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="64">
        <Box
          className="animate-spin"
          rounded="full"
          h="8"
          w="8"
          borderWidth={2}
          borderColor="gray.900"
          borderTopColor="transparent"
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" color="red.700" rounded="lg">
        Error loading hierarchy: {error}
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="fadeInUp">
        <Box maxW="4xl" mx="auto" p={6}>
          <Box bg="white" rounded="lg" shadow="sm" borderWidth={1} borderColor="gray.200" mb={6}>
            <Box p={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={6}>
                <Box as="h2" fontSize="xl" fontWeight="semibold" color="gray.900">
                  Species Structure
                </Box>
                <Box display="flex" gap={4}>
                  <Button size="sm" variant="outline" colorScheme="blue" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" colorScheme="gray" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </Box>

                {apiStatus.loading && (
                  <Box fontSize="sm" color="gray.500">
                    Saving selections...
                  </Box>
                )}
                {apiStatus.error && (
                  <Box fontSize="sm" color="red.500">
                    Error: {apiStatus.error}
                  </Box>
                )}
              </Box>

              <Box>
                {data.map((item) => (
                  <TreeItem
                    key={item.parentField?.id}
                    item={item}
                    level={0}
                    onSelect={handleNodeSelect}
                    selectedNodes={selections}
                  />
                ))}
              </Box>
            </Box>

            <Box mt={6} borderTopWidth={1} borderColor="gray.200" pt={4} px={6} pb={6}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Box as="span" fontSize="sm" color="gray.600">
                    Selected items: {selections.length}
                  </Box>
                  {apiStatus.error && (
                    <Box color="red.500" fontSize="sm" mt={1}>
                      {apiStatus.error}
                    </Box>
                  )}
                </Box>
                <Box>
                  <SubmitButton isDisabled={!selections.length}>Submit Selections</SubmitButton>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Members Selection Box */}
          <Box bg="white" rounded="lg" shadow="sm" borderWidth={1} borderColor="gray.200" mt={6}>
            <Box p={6}>
              <Box as="h2" fontSize="xl" fontWeight="semibold" color="gray.900" mb={4}>
                Add species field contributors
              </Box>
              {/* <UserSelectField name="members" label="Search and select members" mb={4} /> */}
              <AdminInviteField
                name="members"
                label="Search and select members"
                onRemove={(o) => onMemberRemoved(o, [])}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  colorScheme="blue"
                  isLoading={apiStatus.loading}
                  onClick={() => {
                    const memberValues = methods.getValues("members");
                    handleContributorsSubmit(memberValues);
                  }}
                >
                  Add contributors
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}
