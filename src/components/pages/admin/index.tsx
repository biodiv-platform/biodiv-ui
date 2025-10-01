import { Box, Heading, Link, List, SimpleGrid } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

function AdminComponent() {
  const { t } = useTranslation();

  return (
    <Box className="container fadeInUp" pt={6}>
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Utils
          </Heading>
          <List.Root>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/admin/homegallery">{t("group:homepage_customization.title")}</Link>
            </List.Item>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/admin/announcements">{t("admin:links.announcements_configure")}</Link>
            </List.Item>
          </List.Root>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Groups
          </Heading>
          <List.Root>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/group/create">{t("group:create.title")}</Link>
            </List.Item>
          </List.Root>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Maps
          </Heading>
          <List.Root>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/map/create">{t("group:map.title")}</Link>
            </List.Item>
          </List.Root>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Traits
          </Heading>
          <List.Root>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/traits/create">{t("group:trait.title")}</Link>
            </List.Item>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/traits/batch-upload">{t("group:trait.batchUpload.title")}</Link>
            </List.Item>
          </List.Root>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Taxonomy
          </Heading>
          <List.Root>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/taxonomy/name-matching">{t("admin:links.name-macthing")}</Link>
            </List.Item>
          </List.Root>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Species Page
          </Heading>
          <List.Root>
            <List.Item
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/admin/species-fields">{t("admin:links.species_fields")}</Link>
            </List.Item>
          </List.Root>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default AdminComponent;
