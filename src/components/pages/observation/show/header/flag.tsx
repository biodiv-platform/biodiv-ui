import {
  Avatar,
  Badge,
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/core";
import BlueLink from "@components/@core/blue-link";
import UserBadge from "@components/@core/user/badge";
import Select from "@components/form/select";
import Submit from "@components/form/submit-button";
import TextArea from "@components/form/textarea";
import useTranslation from "@configs/i18n/useTranslation";
import { FlagShow } from "@interfaces/observation";
import { axFlagObservation, axUnFlagObservation } from "@services/observation.service";
import { FLAG_OPTIONS } from "@static/constants";
import { adminOrAuthor } from "@utils/auth";
import { getUserImage } from "@utils/media";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import SimpleButton from "./simple-button";

interface IFlagObservationProps {
  flags: FlagShow[];
  setFlags;
  observationId;
  userId;
}

export default function FlagObservation({
  flags,
  setFlags,
  observationId,
  userId
}: IFlagObservationProps) {
  const { t } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const flagOptions = FLAG_OPTIONS.map((f) => ({
    label: t(`OBSERVATION.FLAG.FLAGS.${f}`),
    value: f
  }));

  const [userFlag, setUserFlag] = useState<FlagShow>();

  useEffect(() => {
    setUserFlag(flags.find((f) => f.user.id === userId));
  }, [flags]);

  const hForm = useForm({
    mode: "onChange",
    validationSchema: Yup.object().shape({
      flag: Yup.string().required(),
      notes: Yup.string().required()
    })
  });

  const handleOnFlag = async (payload) => {
    const { success, data } = await axFlagObservation(observationId, payload);
    if (success) {
      setFlags(data);
      onClose();
    }
  };

  const handleOnUnFlag = async (flagId) => {
    const { success, data } = await axUnFlagObservation(observationId, flagId);
    if (success) {
      setFlags(data);
      onClose();
    }
  };

  return (
    <>
      <SimpleButton
        icon={flags.length ? "ibpfillflag" : "ibpoutlineflag"}
        title="FLAG_OBSERVATION"
        variantColor={flags.length ? "red" : "purple"}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalOverlay className="fade" />
        <ModalContent className="fadeInUp" borderRadius="md">
          <form onSubmit={hForm.handleSubmit(handleOnFlag)}>
            <ModalHeader>🚩 Flag observation</ModalHeader>
            <ModalCloseButton />
            {flags.length > 0 && (
              <>
                <Heading size="sm" px={6} mb={3}>
                  flagged by {flags.length} member(s)
                </Heading>
                {flags.map(({ flag, user }) => (
                  <Stack
                    key={flag.id}
                    isInline={true}
                    spacing={4}
                    px={6}
                    py={3}
                    mb={2}
                    borderTop="1px"
                    borderColor="gray.300"
                  >
                    <Avatar size="sm" mt={2} name={user.name} src={getUserImage(user.profilePic)} />
                    <Box>
                      <BlueLink mr={2} href={`/user/show/${user.id}`}>
                        {user.name} <UserBadge isAdmin={user.isAdmin} />
                      </BlueLink>
                      <Badge variantColor="red" verticalAlign="baseline">
                        {t(`OBSERVATION.FLAG.FLAGS.${flag.flag}`)}
                      </Badge>
                      <Text>{flag.notes}</Text>
                    </Box>
                    <Box flexGrow={1} textAlign="right" pt={2}>
                      {adminOrAuthor(user.id) && (
                        <Button
                          size="sm"
                          variant="outline"
                          variantColor="red"
                          onClick={() => handleOnUnFlag(flag.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </Box>
                  </Stack>
                ))}
              </>
            )}
            {!userFlag && (
              <ModalBody>
                <Select
                  name="flag"
                  label={t("OBSERVATION.FLAG.CATEGORY")}
                  options={flagOptions}
                  form={hForm}
                />
                <TextArea mb={0} name="notes" label={t("OBSERVATION.FLAG.NOTES")} form={hForm} />
              </ModalBody>
            )}

            {!userFlag && (
              <ModalFooter>
                <Button onClick={onClose} mr={4}>
                  Close
                </Button>
                <Submit form={hForm} variantColor="red">
                  Flag
                </Submit>
              </ModalFooter>
            )}
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
