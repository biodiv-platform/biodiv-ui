import { Flex, IconButton, useDisclosure } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import { compiledMessage } from "@utils/basic";
import React from "react";

import { SyncInfo } from "./offline-sync";
import { Mq } from "mq-styled-components";

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

    > div {
      padding: 0.9rem 1rem;
    }

    .header {
      background: var(--gray-800);
      color: white;
      display: flex;

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
      max-height: 12rem;
    }
  }
`;

interface SyncBoxProps {
  syncInfo: SyncInfo;
  onClose;
}

export default function SyncBox({ syncInfo, onClose }: SyncBoxProps) {
  const { isOpen, onToggle } = useDisclosure(true);
  const { t } = useTranslation();

  return (
    <SyncBoxContainer>
      <div className="fadeInUp">
        <div className="header">
          <div className="text">{t("OBSERVATION.SYNC.TITLE")}</div>
          <div className="icons">
            <IconButton
              aria-label={t("TOGGLE")}
              icon={"ibpchevron" as any}
              variant="link"
              minW="auto"
              transform={isOpen && "rotate(180deg)"}
              onClick={onToggle}
              mr={5}
            />
            <IconButton
              aria-label={t("CLOSE")}
              icon="close"
              variant="link"
              minW="auto"
              onClick={onClose}
            />
          </div>
        </div>
        {isOpen && (
          <Flex className="content fade" alignItems="center">
            {compiledMessage(t("OBSERVATION.SYNC.CONTENT"), syncInfo)}
          </Flex>
        )}
      </div>
    </SyncBoxContainer>
  );
}
