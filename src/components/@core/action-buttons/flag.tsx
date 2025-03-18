import { Badge, Box, Button, Heading, Stack, Text, useDisclosure } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import UserBadge from "@components/@core/user/badge";
import { SelectInputField } from "@components/form/select";
import { SubmitButton } from "@components/form/submit-button";
import { TextAreaField } from "@components/form/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import FlagFillIcon from "@icons/flag-fill";
import FlagOutlineIcon from "@icons/flag-outline";
import { FlagShow } from "@interfaces/observation";
import { FLAG_OPTIONS } from "@static/constants";
import { ACTIVITY_UPDATED } from "@static/events";
import { adminOrAuthor } from "@utils/auth";
import { getUserImage } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { useState } from "react";
import { emit } from "react-gbus";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

import { Avatar } from "@/components/ui/avatar";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

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

  const { open, onOpen, onClose } = useDisclosure();

  const flagOptions = FLAG_OPTIONS.map((f) => ({
    label: t(`common:actions.flag.flags.${f.toLowerCase()}`),
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
        title={t("common:actions.flag.title")}
        colorPalette={flags && flags?.length ? "red" : "purple"}
        onClick={onOpen}
      />
      <DialogRoot open={open} size="lg" onOpenChange={onClose}>
        <DialogBackdrop className="fade">
          <DialogContent className="fadeInUp" borderRadius="md">
            <FormProvider {...hForm}>
              <form onSubmit={hForm.handleSubmit(handleOnFlag)}>
                <DialogHeader>🚩 Flag {resourceType}</DialogHeader>
                <DialogCloseTrigger />
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
                            direction={"row"}
                            gap={4}
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
                              src={getUserImage(user.profilePic, user.name)}
                            />
                            <Box>
                              <LocalLink href={`/user/show/${user.id}`}>
                                <BlueLink mr={2}>
                                  {user.name} <UserBadge isAdmin={user.isAdmin} />
                                </BlueLink>
                              </LocalLink>
                              <Badge colorPalette="red" verticalAlign="baseline">
                                {t(`common:actions.flag.flags.${flag.flag?.toLowerCase()}`)}
                              </Badge>
                              <Text>{flag.notes}</Text>
                            </Box>
                            <Box flexGrow={1} textAlign="right" pt={2}>
                              {adminOrAuthor(user.id) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  colorPalette="red"
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
                  <DialogBody>
                    <SelectInputField
                      name="flag"
                      label={t("common:actions.flag.category")}
                      options={flagOptions}
                      shouldPortal={true}
                    />
                    <TextAreaField mb={0} name="notes" label={t("common:actions.flag.notes")} />
                  </DialogBody>
                )}

                {!userFlag && (
                  <DialogFooter>
                    <Button onClick={onClose} mr={4}>
                      Close
                    </Button>
                    <SubmitButton colorPalette="red">Flag</SubmitButton>
                  </DialogFooter>
                )}
              </form>
            </FormProvider>
          </DialogContent>
        </DialogBackdrop>
      </DialogRoot>
    </>
  );
}
