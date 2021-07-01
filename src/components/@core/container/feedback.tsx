import { Link } from "@chakra-ui/react";
import styled from "@emotion/styled";
import FeedbackIcon from "@icons/feedback";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const FeedbackButton = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 1.5rem;
  z-index: 10;

  a,
  span {
    display: inline-block;
  }
  span {
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
        shadow="lg"
        bg="blue.500"
        rel="noreferrer"
        aria-label={t("common:feedback")}
        fontSize="lg"
        href="https://forms.gle/G4Gi6NpuvnRRuDCc8"
        target="_blank"
      >
        <FeedbackIcon className="icon" />
        <span>{t("common:feedback")}</span>
      </Link>
    </FeedbackButton>
  );
}
