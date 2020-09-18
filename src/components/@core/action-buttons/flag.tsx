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
import { yupResolver } from "@hookform/resolvers";
import FlagFillIcon from "@icons/flag-fill";
import FlagOutlineIcon from "@icons/flag-outline";
import { FlagShow } from "@interfaces/observation";
import { FLAG_OPTIONS } from "@static/constants";
import { ACTIVITY_UPDATED } from "@static/events";
import { adminOrAuthor } from "@utils/auth";
import { getUserImage } from "@utils/media";
import React, { useEffect } from "react";
import { useState } from "react";
import { emit } from "react-gbus";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import SimpleActionButton from "./simple";

interface IFlagObservationProps {
  initialFlags: FlagShow[];
  resourceId;
  userId;
  flagFunc;
  unFlagFunc;
}

export default function FlagActionButton({
  initialFlags,
  resourceId,
  userId,
  flagFunc,
  unFlagFunc
}: IFlagObservationProps) {
  const { t } = useTranslation();
  const [flags, setFlags] = useState(initialFlags);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const flagOptions = FLAG_OPTIONS.map((f) => ({
    label: t(`ACTIONS.FLAG.FLAGS.${f}`),
    value: f
  }));

  const [userFlag, setUserFlag] = useState<FlagShow>();

  useEffect(() => {
    setUserFlag(flags.find((f) => f.user.id === userId));
  }, [flags]);

  const hForm = useForm({
    mode: "onChange",
    resolver: yupResolver(
      Yup.object().shape({
        flag: Yup.string().required(),
        notes: Yup.string().required()
      })
    )
  });

  const handleOnFlag = async (payload) => {
    const { success, data } = await flagFunc(resourceId, payload);
    if (success) {
      setFlags(data);
      emit(ACTIVITY_UPDATED, resourceId);
      onClose();
    }
  };

  const handleOnUnFlag = async (flagId) => {
    const { success, data } = await unFlagFunc(resourceId, flagId);
    if (success) {
      setFlags(data);
      emit(ACTIVITY_UPDATED, resourceId);
      onClose();
    }
  };

  return (
    <>
      <SimpleActionButton
        icon={flags.length ? <FlagFillIcon /> : <FlagOutlineIcon />}
        title={t("ACTIONS.FLAG.TITLE")}
        colorScheme={flags.length ? "red" : "purple"}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalOverlay className="fade">
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
                      <Avatar
                        size="sm"
                        mt={2}
                        name={user.name}
                        src={getUserImage(user.profilePic)}
                      />
                      <Box>
                        <BlueLink mr={2} href={`/user/show/${user.id}`}>
                          {user.name} <UserBadge isAdmin={user.isAdmin} />
                        </BlueLink>
                        <Badge colorScheme="red" verticalAlign="baseline">
                          {t(`ACTIONS.FLAG.FLAGS.${flag.flag}`)}
                        </Badge>
                        <Text>{flag.notes}</Text>
                      </Box>
                      <Box flexGrow={1} textAlign="right" pt={2}>
                        {adminOrAuthor(user.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
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
                    label={t("ACTIONS.FLAG.CATEGORY")}
                    options={flagOptions}
                    form={hForm}
                  />
                  <TextArea mb={0} name="notes" label={t("ACTIONS.FLAG.NOTES")} form={hForm} />
                </ModalBody>
              )}

              {!userFlag && (
                <ModalFooter>
                  <Button onClick={onClose} mr={4}>
                    Close
                  </Button>
                  <Submit form={hForm} colorScheme="red">
                    Flag
                  </Submit>
                </ModalFooter>
              )}
            </form>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
