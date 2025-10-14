import { Box, Heading, Link, List, SimpleGrid } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { PageHeading } from "@/components/@core/layout";

function AdminComponent() {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("admin:utils"),
      items: [
        { href: "/admin/homegallery", label: t("group:homepage_customization.title") },
        { href: "/admin/announcements", label: t("admin:links.announcements_configure") },
        { href: "/api/memory-cache/clear", label: t("admin:links.clear_cache") }
      ]
    },
    {
      title: t("common:usergroups"),
      items: [{ href: "/group/create", label: t("group:create.title") }]
    },
    {
      title: t("header:menu_secondary.maps.title"),
      items: [{ href: "/map/create", label: t("group:map.title") }]
    },
    {
      title: t("header:menu_secondary.more.traits"),
      items: [
        { href: "/traits/create", label: t("group:trait.title") },
        { href: "/traits/batch-upload", label: t("group:trait.batchUpload.title") }
      ]
    },
    {
      title: t("header:menu_secondary.more.taxonomy"),
      items: [
        { href: "/taxonomy/name-matching", label: t("admin:links.name-macthing") },
        { href: "/taxonomy/create", label: t("admin:links.add_taxon") }
      ]
    },
    {
      title: t("header:menu_secondary.species.title"),
      items: [
        { href: "/admin/species-fields", label: t("admin:links.species_fields") },
        { href: "/species/create", label: t("admin:links.add_species_page") }
      ]
    }
  ];

  return (
    <Box className="container fadeInUp" pt={6}>
      <PageHeading mb={8}>{t("admin:title")}</PageHeading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {sections.map((section) => (
          <Box
            key={section.title}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
              boxShadow: "lg",
              transform: "translateY(-2px)"
            }}
          >
            <Heading size="md" py={4} px={5} color="white" bg="teal" fontWeight="600" m={0}>
              {section.title}
            </Heading>
            <Box p={5}>
              <List.Root gap={2}>
                {section.items.map((item, idx) => (
                  <List.Item
                    key={idx}
                    display="flex"
                    alignItems="center"
                    p={2.5}
                    pl={3}
                    transition="all 0.2s"
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      left: "12px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "full",
                      bg: "teal"
                    }}
                    _hover={{
                      bg: "gray.300",
                      pl: 4
                    }}
                  >
                    <Link href={item.href} ml={3} _hover={{ textDecoration: "none" }} width="100%">
                      {item.label}
                    </Link>
                  </List.Item>
                ))}
              </List.Root>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default AdminComponent;
