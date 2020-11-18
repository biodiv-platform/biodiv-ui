import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import useTranslation from "@hooks/use-translation";
import styled from "@emotion/styled";
import ChevronIcon from "@icons/chevron";
import CrossIcon from "@icons/cross";
import { Mq } from "mq-styled-components";
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
      background: var(--gray-800);
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
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { t } = useTranslation();

  return (
    <SyncBoxContainer>
      <div className="fadeInUp">
        <div className="header">
          <div className="text">{t("OBSERVATION.SYNC.TITLE")}</div>
          <div className="icons">
            <IconButton
              aria-label={t("TOGGLE")}
              icon={<ChevronIcon />}
              variant="link"
              minW="auto"
              transform={isOpen && "rotate(180deg)"}
              onClick={onToggle}
              mr={5}
            />
            <IconButton
              aria-label={t("CLOSE")}
              icon={<CrossIcon />}
              variant="link"
              minW="auto"
              onClick={onClose}
            />
          </div>
        </div>
        {isOpen && (
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
