import { Box, Button, CloseButton, Flex} from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import React, { useState } from "react";
import { LuBell, LuChevronLeft, LuChevronRight } from "react-icons/lu";

import useGlobalState from "@/hooks/use-global-state";
import { getInjectableHTML } from "@/utils/text";

export default function Announcement() {
  const { open, setOpen, announcement, languageId } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % announcement.length);
  };

  const prevAnnouncement = () => {
    setCurrentIndex((prev) => (prev - 1 + announcement.length) % announcement.length);
  };

  const currentAnnouncement = announcement[currentIndex];

  return (
    <>
      {open && announcement != null && announcement.length>0 ? (
        <Box borderLeft="4px solid" bg={currentAnnouncement.bgColor} p={3}>
          <Flex justify="space-between" align="center" gap={2}>
            <Box width={"40px"}>
              {currentIndex != 0 && (
                <Button
                  aria-label="Previous announcement"
                  size="sm"
                  color={currentAnnouncement.color}
                  onClick={prevAnnouncement}
                  bgColor={currentAnnouncement.bgColor}
                >
                  <LuChevronLeft />
                </Button>
              )}
            </Box>
            <Flex align="center" flex="1" gap={3}>
              <Box flexShrink={0}>
                <LuBell color={currentAnnouncement.color} size={18} />
              </Box>
              <Box
                fontSize="sm"
                fontWeight="medium"
                color={currentAnnouncement.color}
                dangerouslySetInnerHTML={{
                  __html: getInjectableHTML(currentAnnouncement.translations[languageId]||currentAnnouncement.translations[SITE_CONFIG.LANG.DEFAULT_ID])
                }}
              ></Box>
            </Flex>
            <Box width={"40px"}>
              {currentIndex != announcement.length-1 && (
                <Button
                  aria-label="Previous announcement"
                  size="sm"
                  color={currentAnnouncement.color}
                  onClick={nextAnnouncement}
                  bgColor={currentAnnouncement.bgColor}
                >
                  <LuChevronRight />
                </Button>
              )}
            </Box>
            <CloseButton
              size="sm"
              onClick={() => setOpen(false)}
              color={currentAnnouncement.color}
            />
          </Flex>
        </Box>
      ) :
      null}
    </>
  );
}
