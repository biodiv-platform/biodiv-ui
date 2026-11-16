import { Box, Button, CloseButton, Flex, Link } from "@chakra-ui/react";
import SITE_CONFIG from "@configs/site-config";
import { ENDPOINT } from "@static/constants";
import { useEffect, useRef, useState } from "react";
import { LuBell, LuChevronLeft, LuChevronRight, LuDownload } from "react-icons/lu";

import useGlobalState from "@/hooks/use-global-state";
import { AnnouncementType } from "@/interfaces/utility";
import { getInjectableHTML } from "@/utils/text";

/** Id used for the "name matching file is ready" item so it never clashes with a real announcement */
const NAME_MATCHING_ID = -1;
/** localStorage key holding the file name of the last name-matching notice the user closed */
const NAME_MATCHING_DISMISSED_KEY = "nameMatchingDismissedFile";

type AnnouncementItem = AnnouncementType & { fileName?: string; fileUrl?: string };

const getDismissedNameMatchingFile = () => {
  try {
    return localStorage.getItem(NAME_MATCHING_DISMISSED_KEY);
  } catch (e) {
    return null;
  }
};

const setDismissedNameMatchingFile = (fileName) => {
  try {
    localStorage.setItem(NAME_MATCHING_DISMISSED_KEY, fileName);
  } catch (e) {
    // storage unavailable; the notice will just show again next time
  }
};

/** Builds the banner item for the user's latest name-matching result, or null if there is none / it was closed */
const buildNameMatchingItem = (nameMatchingFile): AnnouncementItem | null => {
  if (!nameMatchingFile?.filePath) return null;
  if (getDismissedNameMatchingFile() === nameMatchingFile.fileName) return null;

  return {
    id: NAME_MATCHING_ID,
    bgColor: "#C6F6D5",
    color: "#22543D",
    translations: {},
    fileName: nameMatchingFile.fileName,
    fileUrl: `${ENDPOINT.RAW}${nameMatchingFile.filePath}`
  };
};

export default function Announcement() {
  const { open, setOpen, announcement, nameMatchingFile, languageId } = useGlobalState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<AnnouncementItem[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const CYCLE_SPEED = 5000;

  // Initialize filtered announcements when announcements or the name-matching file change.
  // The name-matching notice goes first so the user sees it straight away.
  useEffect(() => {
    if (open == true) {
      const nameMatchingItem = buildNameMatchingItem(nameMatchingFile);
      const announcements = Array.isArray(announcement) ? announcement : [];
      setFilteredAnnouncements(
        nameMatchingItem ? [nameMatchingItem, ...announcements] : announcements
      );
      setCurrentIndex(0);
    }
  }, [announcement, nameMatchingFile, open]);

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
    const closing = filteredAnnouncements[currentIndex];
    if (closing?.id === NAME_MATCHING_ID && closing.fileName) {
      // Don't show the notice for this file again; a newer file will show a new notice
      setDismissedNameMatchingFile(closing.fileName);
    }

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
          {currentAnnouncement.id === NAME_MATCHING_ID ? (
            <Flex
              fontSize="sm"
              fontWeight="medium"
              color={currentAnnouncement.color}
              align="center"
              gap={2}
              wrap="wrap"
            >
              <span>
                Your name matching file <b>{currentAnnouncement.fileName}</b> is ready.
              </span>
              <Link
                href={currentAnnouncement.fileUrl}
                color={currentAnnouncement.color}
                textDecoration="underline"
                fontWeight="bold"
                download
              >
                <LuDownload /> Download
              </Link>
            </Flex>
          ) : (
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
          )}
        </Flex>

        <Box width="40px">
          {filteredAnnouncements.length > 1 &&
            currentIndex !== filteredAnnouncements.length - 1 && (
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
