import { Box, Flex, Link, SimpleGrid } from "@chakra-ui/core";
import { UpDownIcon } from "@chakra-ui/icons";
import LocalLink from "@components/@core/local-link";
import useGlobalState from "@hooks/use-global-state";
import { axGetPages } from "@services/pages.service";
import React, { useEffect, useState } from "react";

export default function PagesSidebar() {
  const { currentGroup } = useGlobalState();

  const [pages, setPages] = useState([]);

  useEffect(() => {
    axGetPages(currentGroup?.id).then(({ data }) => setPages(data));
  }, []);

  return (
    <Box className="fadeInUp delay-2">
      {pages.map((parentPage) => (
        <Box borderWidth="1px" borderColor="gray.300" borderRadius="md" key={parentPage.id} mb={2}>
          <Flex bg="gray.200" justifyContent="space-between" p={3} alignItems="center">
            <LocalLink href={`/page/${parentPage.id}`}>
              <Link display="block">{parentPage.title}</Link>
            </LocalLink>
            {parentPage.childs.length > 0 && <UpDownIcon />}
          </Flex>
          {parentPage.childs.length > 0 && (
            <SimpleGrid spacingY={2} p={3}>
              {parentPage.childs.map((page) => (
                <Box key={page.id} w="full">
                  <LocalLink href={`/page/${page.id}`}>
                    <Link>{page.title}</Link>
                  </LocalLink>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      ))}
    </Box>
  );
}
