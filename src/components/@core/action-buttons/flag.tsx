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
} from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import UserBadge from "@components/@core/user/badge";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import useTranslation from "@hooks/use-translation";
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
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import LocalLink from "../local-link";
import SimpleActionButton from "./simple";

interface IFlagObservationProps {
  initialFlags: FlagShow[] | undefined;
  resourceType?;
  resourceId;
  userId;
  flagFunc;
  unFlagFunc;
}

export default function FlagActionButton({
  initialFlags,
  resourceId,
  resourceType = "observation",
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

  const [userFlag, setUserFlag] = useState<any>();

  useEffect(() => {
    setUserFlag(flags?.find((f) => f.user?.id === userId));
  }, [flags]);

  const hForm = useForm<any>({
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
        icon={flags && flags.length ? <FlagFillIcon /> : <FlagOutlineIcon />}
        title={t("ACTIONS.FLAG.TITLE")}
        colorScheme={flags && flags?.length ? "red" : "purple"}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalOverlay className="fade">
          <ModalContent className="fadeInUp" borderRadius="md">
            <FormProvider {...hForm}>
              <form onSubmit={hForm.handleSubmit(handleOnFlag)}>
                <ModalHeader>🚩 Flag {resourceType}</ModalHeader>
                <ModalCloseButton />
                {flags && flags.length > 0 && (
                  <>
                    <Heading size="sm" px={6} mb={3}>
                      flagged by {flags?.length} member(s)
                    </Heading>
                    {flags?.map(
                      ({ flag, user }) =>
                        flag &&
                        user && (
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
                              <LocalLink href={`/user/show/${user.id}`}>
                                <BlueLink mr={2}>
                                  {user.name} <UserBadge isAdmin={user.isAdmin} />
                                </BlueLink>
                              </LocalLink>
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
                        )
                    )}
                  </>
                )}
                {!userFlag && (
                  <ModalBody>
                    <SelectInputField
                      name="flag"
                      label={t("ACTIONS.FLAG.CATEGORY")}
                      options={flagOptions}
                      shouldPortal={true}
                    />
                    <TextAreaField mb={0} name="notes" label={t("ACTIONS.FLAG.NOTES")} />
                  </ModalBody>
                )}

                {!userFlag && (
                  <ModalFooter>
                    <Button onClick={onClose} mr={4}>
                      Close
                    </Button>
                    <SubmitButton colorScheme="red">Flag</SubmitButton>
                  </ModalFooter>
                )}
              </form>
            </FormProvider>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
}
