import { Box } from "@chakra-ui/react";
import { SubmitButton } from "@components/form/submit-button";
import { axGetAllFieldsMeta } from "@services/species.service";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
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
              <Box
                onClick={handleSelect}
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

                  <Box
                    onClick={() =>
                      onSelect({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [apiStatus, setApiStatus] = useState({ loading: false, error: "" });

  const methods = useForm({
    defaultValues: {
      selectedNodes: []
    }
  });

  const { setValue } = methods;
  const [selections, setSelections] = useState<SelectedNode[]>([]);

  const handleNodeSelect = (node: SelectedNode) => {
    setSelections((prev) => {
      const isSelected = prev.some((n) => n.id === node.id);
      let newSelections;

      if (isSelected) {
        newSelections = prev.filter((n) => n.id !== node.id);
      } else {
        newSelections = [...prev, node];
      }

      setValue("selectedNodes", newSelections);
      return newSelections;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await axGetAllFieldsMeta({ langId: 205 });
        setData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setLoading(false);
      }
    };

    if (initialData.length === 0) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [initialData]);

  const handleFormSubmit = async () => {
    if (!selections.length) {
      setApiStatus({ loading: false, error: "Please select at least one item" });
      return;
    }

    try {
      setApiStatus({ loading: true, error: "" });
      await Promise.resolve(onSubmit(selections));
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
          <Box bg="white" rounded="lg" shadow="sm" borderWidth={1} borderColor="gray.200">
            <Box p={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={6}>
                <Box as="h2" fontSize="xl" fontWeight="semibold" color="gray.900">
                  Species Structure
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
        </Box>
      </form>
    </FormProvider>
  );
}
