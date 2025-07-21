import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import styled from "@emotion/styled";
import ChevronIcon from "@icons/chevron";
import CrossIcon from "@icons/cross";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { SyncInfo } from "./offline-sync";
import SyncRow from "./sync-row";

const SyncBoxContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 12;
  width: 100%;
  max-width: 25rem;

  ${Mq.max.sm} {
    max-width: 100%;
  }

  > div {
    width: 100%;
    background: white;
    border-radius: 0.25rem;
    overflow: hidden;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);

    .header {
      background: var(--chakra-colors-gray-800);
      color: white;
      display: flex;
      padding: 0.9rem 1rem;

      .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-grow: 1;
      }
      .icons {
        flex-shrink: 0;
      }
    }

    .content {
      max-height: 14rem;
      overflow: auto;
    }
  }
`;

interface SyncBoxProps {
  syncInfo: SyncInfo;
  pendingObservations;
  deleteObservation;
  onClose;
}

export default function SyncBox({
  syncInfo,
  pendingObservations,
  deleteObservation,
  onClose
}: SyncBoxProps) {
  const { open, onToggle } = useDisclosure({ defaultOpen: true });
  const { t } = useTranslation();

  return (
    <SyncBoxContainer>
      <div className="fadeInUp">
        <div className="header">
          <div className="text">{t("observation:sync.title")}</div>
          <div className="icons">
            <IconButton
              aria-label={t("common:toggle")}
              variant="plain"
              minW="auto"
              transform={open ? "rotate(180deg)" : undefined}
              onClick={onToggle}
              mr={5}
            >
              <ChevronIcon />
            </IconButton>
            <IconButton
              aria-label={t("common:close")}
              variant="plain"
              minW="auto"
              onClick={onClose}
            >
              <CrossIcon />
            </IconButton>
          </div>
        </div>
        {open && (
          <Box className="content fade" alignItems="center">
            {pendingObservations.map((pendingObservation) => (
              <SyncRow
                key={pendingObservation.id}
                pendingObservation={pendingObservation}
                syncInfo={syncInfo}
                deleteObservation={deleteObservation}
              />
            ))}
          </Box>
        )}
      </div>
    </SyncBoxContainer>
  );
}
