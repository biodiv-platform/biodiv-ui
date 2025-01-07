import { Box, Heading, Link, List, ListItem, SimpleGrid } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

function AdminComponent() {
  const { t } = useTranslation();

  return (
    <Box className="container fadeInUp" pt={6}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Utils
          </Heading>
          <List>
            <ListItem
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/admin/notifications">{t("admin:links.notification")}</Link>
            </ListItem>
            <ListItem
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/admin/homegallery">{t("group:homepage_customization.title")}</Link>
            </ListItem>
          </List>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Groups
          </Heading>
          <List>
            <ListItem
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/group/create">{t("group:create.title")}</Link>
            </ListItem>
          </List>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Maps
          </Heading>
          <List>
            <ListItem
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/map/create">{t("group:map.title")}</Link>
            </ListItem>
          </List>
        </Box>
        <Box borderWidth="1px" borderRadius="md" boxShadow="sm" p="4" bg="white">
          <Heading size="md" mb="4" color="teal" borderBottom="1px solid" borderColor="gray.200">
            Traits
          </Heading>
          <List>
            <ListItem
              display="flex"
              alignItems="center"
              p="2"
              borderRadius="md"
              _hover={{ bg: "teal", color: "white" }}
            >
              <Link href="/traits/create">{t("group:trait.title")}</Link>
            </ListItem>
          </List>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default AdminComponent;
