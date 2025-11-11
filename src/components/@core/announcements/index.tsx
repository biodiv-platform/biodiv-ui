import { Box, Button, CloseButton, Flex } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import React, { useEffect, useRef, useState } from "react";
import { LuBell, LuChevronLeft, LuChevronRight } from "react-icons/lu";

import useGlobalState from "@/hooks/use-global-state";
import { AnnouncementType } from "@/interfaces/utility";
import { getInjectableHTML } from "@/utils/text";

export default function Announcement() {
  const { open, setOpen, announcement, languageId } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<AnnouncementType[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const CYCLE_SPEED = 5000;

  // Initialize filtered announcements when announcement prop changes
  useEffect(() => {
    if (announcement && open == true) {
      setFilteredAnnouncements(announcement);
      setCurrentIndex(0);
    }
  }, [announcement, open]);

  // Auto-rotation effect
  useEffect(() => {
    if (open && filteredAnnouncements && filteredAnnouncements.length > 1 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredAnnouncements.length);
      }, CYCLE_SPEED);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [open, filteredAnnouncements, isPaused]);

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredAnnouncements.length);
  };

  const prevAnnouncement = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredAnnouncements.length) % filteredAnnouncements.length
    );
  };

  const handleCloseCurrent = () => {
    if (filteredAnnouncements.length === 1) {
      // If this is the last announcement, close the entire banner
      setOpen(false);
    } else {
      // Remove current announcement from the filtered list
      const newAnnouncements = filteredAnnouncements.filter((_, index) => index !== currentIndex);
      setFilteredAnnouncements(newAnnouncements);
      // Adjust current index if needed
      if (currentIndex >= newAnnouncements.length) {
        setCurrentIndex(newAnnouncements.length - 1);
      }
    }
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (!open || !filteredAnnouncements || filteredAnnouncements.length === 0) {
    return null;
  }

  const currentAnnouncement = filteredAnnouncements[currentIndex];

  return (
    <Box
      borderLeft="4px solid"
      bg={currentAnnouncement.bgColor}
      p={3}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex justify="space-between" align="center" gap={2}>
        <Box width="40px">
          {filteredAnnouncements.length > 1 && currentIndex !== 0 && (
            <Button
              aria-label="Previous announcement"
              size="sm"
              color={currentAnnouncement.color}
              onClick={prevAnnouncement}
              bgColor={currentAnnouncement.bgColor}
              _hover={{ bg: "rgba(255,255,255,0.2)" }}
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
              __html: getInjectableHTML(
                currentAnnouncement.translations[languageId] ||
                  currentAnnouncement.translations[SITE_CONFIG.LANG.DEFAULT_ID]
              )
            }}
          />
        </Flex>

        <Box width="40px">
          {filteredAnnouncements.length > 1 && currentIndex !== filteredAnnouncements.length - 1 && (
            <Button
              aria-label="Next announcement"
              size="sm"
              color={currentAnnouncement.color}
              onClick={nextAnnouncement}
              bgColor={currentAnnouncement.bgColor}
              _hover={{ bg: "rgba(255,255,255,0.2)" }}
            >
              <LuChevronRight />
            </Button>
          )}
        </Box>

        <CloseButton
          size="sm"
          onClick={handleCloseCurrent}
          color={currentAnnouncement.color}
          _hover={{ bg: "rgba(255,255,255,0.2)" }}
          aria-label={`Close this announcement (${currentIndex + 1} of ${
            filteredAnnouncements.length
          })`}
        />
      </Flex>
    </Box>
  );
}
