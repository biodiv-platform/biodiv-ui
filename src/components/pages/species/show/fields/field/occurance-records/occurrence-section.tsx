import { Box, Collapsible, Flex, IconButton, Text, useDisclosure } from "@chakra-ui/react";
import { ReactNode } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

interface OccurrenceSectionProps {
  id: string;
  icon: ReactNode;
  title: string;
  /** one line under the heading */
  description?: ReactNode;
  children: ReactNode;
}

/** Collapsible sub-section of the species Occurrence panel, with a green heading bar */
export default function OccurrenceSection({
  id,
  icon,
  title,
  description,
  children
}: OccurrenceSectionProps) {
  const { open, onToggle } = useDisclosure({ defaultOpen: true });

  return (
    <Box id={id} borderWidth="1px" borderColor="green.100" borderRadius="lg" mb={4}>
      <Flex
        align="center"
        gap={3}
        bg="green.50"
        borderTopRadius="lg"
        borderBottomRadius={open ? 0 : "lg"}
        pl={4}
        pr={1}
        minH="3rem"
      >
        <Box color="green.600" fontSize="xl" aria-hidden="true">
          {icon}
        </Box>
        <Text as="h3" flex={1} fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <IconButton
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={open}
          variant="ghost"
          onClick={onToggle}
        >
          {open ? <LuChevronUp /> : <LuChevronDown />}
        </IconButton>
      </Flex>
      <Collapsible.Root open={open}>
        <Collapsible.Content>
          <Box p={4}>
            {description && (
              <Text color="gray.600" mb={4}>
                {description}
              </Text>
            )}
            {children}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
