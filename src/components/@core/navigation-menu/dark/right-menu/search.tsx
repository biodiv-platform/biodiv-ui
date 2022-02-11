import { Box, Input } from "@chakra-ui/react";
import { googleSearch } from "@utils/search";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Search() {
  const { t } = useTranslation();

  const handleOnSearch = (e) => {
    e.preventDefault();
    googleSearch(e.target.elements["search"].value);
  };

  return (
    <Box
      as="form"
      mb={{ base: 3, md: 0 }}
      w={{ base: "full", md: "10rem" }}
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
