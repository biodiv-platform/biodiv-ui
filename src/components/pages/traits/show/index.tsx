import { Box, Heading, Image,SimpleGrid, Text } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { getTraitIcon } from "@utils/media";
import React from "react";

export default function TraitsShowComponent({ data }) {
  return (
    <div className="container mt">
      <PageHeading>
        <Heading as="div" size="l" mt={2}>
          {data.traits.name}
        </Heading>
      </PageHeading>
      <Box className="white-box" mb={4}>
        <SimpleGrid columns={[1, 1, 3, 3]} spacingY={4} p={4}>
          <Text fontWeight={600}>Description</Text>
          <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
            {data.traits.description}
          </Box>
          <Text fontWeight={600}>Values</Text>
          <Box gridColumn={[1, 1, "2/4", "2/4"]} wordBreak="break-all" mb={[4, 4, 0, 0]}>
          <SimpleGrid columns={[1, 2, 3,4]} spacing={4}>
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
              <Image
          boxSize="2.2rem"
          objectFit="contain"
          src={getTraitIcon(valueObj.icon)}
          alt={valueObj.icon}
          ignoreFallback={true}
        />
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
