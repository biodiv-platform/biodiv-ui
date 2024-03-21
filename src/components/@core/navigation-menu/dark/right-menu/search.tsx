import { Box, Input } from "@chakra-ui/react";
import { googleSearch } from "@utils/search";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Search() {
  const { t, lang } = useTranslation();

  const handleOnSearch = (e) => {
    e.preventDefault();
    googleSearch(e.target.elements["search"].value, lang);
  };

  return (
    <Box
      as="form"
      mb={{ base: 3 }}
      w={{ base: "full", md: "full" }}
      onSubmit={handleOnSearch}
      color="initial"
    >
      <Input
        size="sm"
        borderRadius="3xl"
        name="search"
        type="search"
        placeholder={t("header:search")}
      />
    </Box>
  );
}
