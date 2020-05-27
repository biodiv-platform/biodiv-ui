import { Icon, Link } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import styled from "@emotion/styled";
import React from "react";

const FeedbackButton = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 1.5rem;
  z-index: 10;
  a {
    display: inline-block;
    transform: scale(0.9);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 1px 2px rgba(0, 0, 0, 0.23);
    &:hover {
      transform: scale(1);
    }
  }
  .icon {
    font-size: 1.4rem;
  }
  span {
    display: inline-block;
    transition: width 0.5s;
    margin-left: 0.5rem;
  }
  @media (max-width: 600px) {
    span {
      display: none;
    }
  }
`;

export default function Feedback() {
  const { t } = useTranslation();
  return (
    <FeedbackButton>
      <Link
        py={3}
        px={4}
        color="white"
        borderRadius="3rem"
        bg="blue.500"
        rel="noreferrer"
        aria-label={t("FEEDBACK")}
        fontSize="lg"
        href="https://forms.gle/G4Gi6NpuvnRRuDCc8"
        target="_blank"
      >
        <Icon name="feedback" className="icon" />
        <span>{t("FEEDBACK")}</span>
      </Link>
    </FeedbackButton>
  );
}
