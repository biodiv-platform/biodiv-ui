import { Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { getTraitIcon } from "@utils/media";
import React, { useMemo } from "react";

export default function SimpleTraitShow({ values, options }) {
  const finalValues = useMemo(() => {
    const valueIds = values.map((fact) => fact.valueId);
    return options.filter((option) => valueIds.includes(option.id));
  }, [values]);

  return (
    <SimpleGrid columns={{ md: 3 }} spacing={4}>
      {finalValues.map((value) => (
        <Flex
          key={value.id}
          alignItems="center"
          border="2px"
          borderColor="gray.200"
          borderRadius="md"
          lineHeight={1}
          p={2}
          h="3.25rem"
        >
          {value?.icon && (
            <Image
              objectFit="contain"
              boxSize="32px"
              mr={2}
              src={getTraitIcon(value?.icon)}
              alt={value.value}
              ignoreFallback={true}
            />
          )}
          <div>{value.value}</div>
        </Flex>
      ))}
    </SimpleGrid>
  );
}
