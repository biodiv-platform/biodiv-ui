import { Avatar, AvatarGroup, Box, Button, Stack, Text } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import Flash from "@components/@core/flash";
import ScientificName from "@components/@core/scientific-name";
import useGlobalState from "@hooks/use-global-state";
import CheckIcon from "@icons/check";
import CrossIcon from "@icons/cross";
import LockIcon from "@icons/lock";
import UnlockIcon from "@icons/unlock";
import { AllRecoSugguestions, RecoIbp } from "@interfaces/observation";
import {
  axAgreeRecoVote,
  axRemoveRecoVote,
  axUnlockRecoVote,
  axValidateRecoVote
} from "@services/observation.service";
import { waitForAuth } from "@utils/auth";
import { getUserImage } from "@utils/media";
import { stripTags } from "@utils/text";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import { Tooltip } from "@/components/ui/tooltip";

enum RecoAction {
  Agree,
  Remove,
  Validate,
  Unlock
}

interface IRecoSuggestionProps {
  observationId;
  recoIbp: RecoIbp | undefined;
  allRecoVotes: AllRecoSugguestions[] | undefined;
  isLocked?;
  recoUpdated;
  permission?;
  permissionOverride?: any;
}

export default function RecoSuggestion({
  observationId,
  recoIbp,
  allRecoVotes,
  isLocked,
  recoUpdated,
  permission,
  permissionOverride
}: IRecoSuggestionProps) {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useGlobalState();

  const recoVoteOperation = async (func, reco: AllRecoSugguestions) => {
    await waitForAuth();
    const { success, data } = await func(observationId, {
      commonName: reco.commonName,
      scientificName: reco.scientificName,
      taxonId: reco.taxonId
    });
    if (success) {
      recoUpdated(data);
    }
  };

  const recoVoteAction = (reco, action) => {
    switch (action) {
      case RecoAction.Agree:
        recoVoteOperation(axAgreeRecoVote, reco);
        break;
      case RecoAction.Remove:
        recoVoteOperation(axRemoveRecoVote, reco);
        break;
      case RecoAction.Validate:
        recoVoteOperation(axValidateRecoVote, reco);
        break;
      case RecoAction.Unlock:
        recoVoteOperation(axUnlockRecoVote, reco);
        break;
      default:
        break;
    }
  };

  return allRecoVotes ? (
    <>
      {allRecoVotes.map((reco) => {
        const recoUserIds = reco.userList?.map((u) => u.id);
        const canAccept = recoUserIds?.includes(user?.id || -1);
        const canValidate = permission?.includes(reco.taxonId) || permissionOverride;
        return (
          <Flash value={reco} key={reco.taxonId}>
            <Stack
              direction={{ base: "column", md: "row" }}
              alignItems={{ md: "center" }}
              borderBottom="1px"
              borderColor="gray.300"
              px={4}
              py={2}
            >
              <Stack flexGrow={1} direction={"row"} justifyContent="space-between">
                <Box minH="3rem">
                  {reco.speciesId ? (
                    <BlueLink
                      className="elipsis"
                      href={`/species/show/${reco.speciesId}`}
                      title={stripTags(reco.scientificName)}
                    >
                      <ScientificName value={reco.scientificName} />
                    </BlueLink>
                  ) : (
                    <Text className="elipsis">
                      <ScientificName value={reco.scientificName} />
                    </Text>
                  )}
                  <Text className="elipsis" color="gray.700" title={reco.commonName}>
                    {reco.commonName}
                  </Text>
                </Box>
                {/* max={2} */}
                <AvatarGroup size="sm" stacking="first-on-top">
                  {reco.userList?.slice(0, 2).map((u, index) => (
                    <Tooltip
                      ids={{ trigger: `obs-${observationId}-user-${u.id}-i-${index}` }}
                      content={u.name}
                    >
                      <Avatar.Root ids={{ root: `obs-${observationId}-user-${u.id}-i-${index}` }}>
                        <Avatar.Fallback name={u.name} />
                        <Avatar.Image src={getUserImage(u.profilePic, u.name)} />
                      </Avatar.Root>
                    </Tooltip>
                  ))}
                  {reco.userList && reco.userList.length > 2 && (
                    <Avatar.Root>
                      <Avatar.Fallback>+{reco.userList.length - 2}</Avatar.Fallback>
                    </Avatar.Root>
                  )}
                </AvatarGroup>
              </Stack>
              <Stack direction={"row"} minW="210px" flexShrink={0} className="reco-actions">
                {!isLocked && (
                  <Button
                    variant="outline"
                    size="sm"
                    minW="100px"
                    colorPalette={canAccept ? "red" : "green"}
                    onClick={() =>
                      recoVoteAction(reco, canAccept ? RecoAction.Remove : RecoAction.Agree)
                    }
                  >
                    {canAccept ? <CrossIcon /> : <CheckIcon />}
                    {t(canAccept ? "observation:id.remove" : "observation:id.agree")}
                  </Button>
                )}

                {(!isLocked || (isLocked && recoIbp?.taxonId === reco.taxonId)) &&
                  canValidate &&
                  isLoggedIn && (
                    <Button
                      minW="100px"
                      size="sm"
                      variant="outline"
                      colorPalette={isLocked ? "blue" : "red"}
                      ml={2}
                      onClick={() =>
                        recoVoteAction(reco, isLocked ? RecoAction.Unlock : RecoAction.Validate)
                      }
                    >
                      {isLocked ? <UnlockIcon /> : <LockIcon />}
                      {t(isLocked ? "observation:id.unlock" : "observation:id.validate")}
                    </Button>
                  )}
              </Stack>
            </Stack>
          </Flash>
        );
      })}
    </>
  ) : null;
}
