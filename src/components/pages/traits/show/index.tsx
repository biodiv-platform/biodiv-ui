import { EditIcon } from "@chakra-ui/icons";
import { Box, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { PageHeading } from "@components/@core/layout";
import { useLocalRouter } from "@components/@core/local-link";
import { Role } from "@interfaces/custom";
import { hasAccess } from "@utils/auth";
import { getTraitIcon } from "@utils/media";
import React, { useEffect, useState } from "react";

export default function TraitsShowComponent({ data }) {
  const router = useLocalRouter();
  const [canEdit, setCanEdit] = useState<boolean>();

  useEffect(() => {
    setCanEdit(hasAccess([Role.Admin]));
  }, []);
  function handleOnEdit() {
    router.push(`/traits/edit/${data.traits.id}`, true);
  }
  return (
    <div className="container mt">
      <SimpleGrid columns={{ base: 1, md: 2 }}>
        <PageHeading>
          <Heading as="div" size="l" mt={2}>
            {data.traits.name}
          </Heading>
        </PageHeading>
        {canEdit && (
          <Box alignContent={"center"} paddingLeft={"90%"}>
            <SimpleActionButton
              icon={<EditIcon />}
              title={"Trait edit"}
              onClick={handleOnEdit}
              colorScheme="teal"
            />
          </Box>
        )}
      </SimpleGrid>
      <Box className="white-box" mb={4}>
        <SimpleGrid columns={[1, 1, 3, 3]} spacingY={4} p={4}>
          {data.traits.icon && <Text fontWeight={600}>Icon</Text>}
          {data.traits.icon && (
            <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
              <Image
                boxSize="2.2rem"
                objectFit="contain"
                src={getTraitIcon(data.traits.icon)}
                alt={data.traits.icon}
                ignoreFallback={true}
              />
            </Box>
          )}
          <Text fontWeight={600}>Description</Text>
          <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
            {data.traits.description}
          </Box>
          {data.values.length != 0 && <Text fontWeight={600}>Values</Text>}
          {data.values.length != 0 && (
            <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
              <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all" fontWeight={600}>
                  Icon
                </Box>
                <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all" fontWeight={600}>
                  Value
                </Box>
                <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all" fontWeight={600}>
                  Description
                </Box>
                <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all" fontWeight={600}>
                  Source
                </Box>
              </SimpleGrid>
              {data.values.map((valueObj) => (
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
                  <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all">
                    {valueObj.icon != null && (
                      <Image
                        boxSize="2.2rem"
                        objectFit="contain"
                        src={getTraitIcon(valueObj.icon)}
                        alt={valueObj.icon}
                        ignoreFallback={true}
                      />
                    )}
                  </Box>
                  <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all">
                    {valueObj.value}
                  </Box>
                  <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all">
                    {valueObj.description}
                  </Box>
                  <Box p={4} borderRadius="md" boxShadow="sm" wordBreak="break-all">
                    {data.traits.source}
                  </Box>
                </SimpleGrid>
              ))}
            </Box>
          )}
          <Text fontWeight={600}>Trait Type</Text>
          <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
            {data.traits.traitTypes}
          </Box>
          <Text fontWeight={600}>Data Type</Text>
          <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
            {data.traits.dataType}
          </Box>
        </SimpleGrid>
      </Box>
    </div>
  );
}
