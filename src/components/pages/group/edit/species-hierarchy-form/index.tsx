import { Box } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { axGetAllFieldsMeta } from "@services/species.service";
import { Check } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface SelectedNode {
  id: number;
  header: string;
  path: string;
  label: string;
}

interface SpeciesHierarchyProps {
  onSubmit: (selectedNodes: SelectedNode[]) => void | Promise<void>;
  initialData?: any[];
}

interface FormValues {
  selectedNodes: SelectedNode[];
}

const TreeItem = React.memo(
  ({
    item,
    level,
    selectedNodes,
    onToggleSelect
  }: {
    item: any;
    level: number;
    selectedNodes: Set<number>;
    onToggleSelect: (node: SelectedNode) => void;
  }) => {
    if (!item?.parentField) return null;

    const { parentField, childField = [], childFields = [] } = item;
    const isLeaf = !childField?.length && !childFields?.length;
    const isSelected = selectedNodes.has(parentField.id);

    return (
      <Box>
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
              <Box
                onClick={() =>
                  onToggleSelect({
                    id: parentField.id,
                    header: parentField.header,
                    path: parentField.path,
                    label: parentField.label
                  })
                }
                cursor="pointer"
                w="5"
                h="5"
                rounded="md"
                borderWidth={1}
                mr={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={isSelected ? "blue.500" : "white"}
                borderColor={isSelected ? "blue.500" : "gray.300"}
                _hover={{ borderColor: "blue.300" }}
              >
                {isSelected && <Check size={16} color="white" />}
              </Box>
            )}
          </Box>
        </Box>

        <Box ml={level > 0 ? 6 : 0}>
          {childField?.map((child: any) => (
            <TreeItem
              key={child.parentField?.id}
              item={child}
              level={level + 1}
              selectedNodes={selectedNodes}
              onToggleSelect={onToggleSelect}
            />
          ))}

          {childFields?.map((subItem: any) => {
            const isSubItemSelected = selectedNodes.has(subItem.id);

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

                  <Box
                    onClick={() =>
                      onToggleSelect({
                        id: subItem.id,
                        header: subItem.header,
                        path: subItem.path,
                        label: subItem.label
                      })
                    }
                    cursor="pointer"
                    w="5"
                    h="5"
                    rounded="md"
                    borderWidth={1}
                    mr={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={isSubItemSelected ? "blue.500" : "white"}
                    borderColor={isSubItemSelected ? "blue.500" : "gray.300"}
                    _hover={{ borderColor: "blue.300" }}
                  >
                    {isSubItemSelected && <Check size={16} color="white" />}
                  </Box>
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
  initialData = []
}: SpeciesHierarchyProps) {
  const [data, setData] = useState<any[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [error, setError] = useState("");
  const [selectedNodeMap] = useState(() => new Map<number, SelectedNode>());
  const [selectedNodeIds] = useState(() => new Set<number>());

  // Initialize form context with proper type
  const methods = useForm<FormValues>({
    defaultValues: {
      selectedNodes: []
    }
  });

  const handleToggleSelect = useCallback(
    (node: SelectedNode) => {
      if (selectedNodeMap.has(node.id)) {
        selectedNodeMap.delete(node.id);
        selectedNodeIds.delete(node.id);
      } else {
        selectedNodeMap.set(node.id, node);
        selectedNodeIds.add(node.id);
      }
      // Update form value
      methods.setValue("selectedNodes", Array.from(selectedNodeMap.values()));
    },
    [selectedNodeMap, selectedNodeIds, methods]
  );

  const handleSubmit = methods.handleSubmit(async () => {
    if (selectedNodeMap.size === 0) return;

    try {
      await onSubmit(Array.from(selectedNodeMap.values()));
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    if (initialData.length > 0) return;

    let mounted = true;
    const loadData = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({ langId: 205 });
        if (mounted) setData(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [initialData]);

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
      <form onSubmit={handleSubmit}>
        <Box maxW="4xl" mx="auto" p={6}>
          <Box bg="white" rounded="lg" shadow="sm" borderWidth={1} borderColor="gray.200">
            <Box p={6}>
              <Box as="h2" fontSize="xl" fontWeight="semibold" color="gray.900" mb={6}>
                Species Structure
              </Box>
              <Box>
                {data.map((item) => (
                  <TreeItem
                    key={item.parentField?.id}
                    item={item}
                    level={0}
                    selectedNodes={selectedNodeIds}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </Box>
            </Box>

            <Box mt={6} borderTopWidth={1} borderColor="gray.200" pt={4} px={6} pb={6}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box as="span" fontSize="sm" color="gray.600">
                  Selected items: {selectedNodeMap.size}
                </Box>
                <Box>
                  <SubmitButton isDisabled={selectedNodeMap.size === 0}>
                    Submit Selections
                  </SubmitButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
}
