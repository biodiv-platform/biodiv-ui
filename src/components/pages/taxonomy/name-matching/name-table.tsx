import { Badge, Box, Button, IconButton, Image, Text, useDisclosure } from "@chakra-ui/react";
import SimpleActionButton from "@components/@core/action-buttons/simple";
import { axCheckSpecies } from "@services/species.service";
import { TAXON_BADGE_COLORS } from "@static/constants";
import { getLocalIcon } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { LuDelete, LuPencil } from "react-icons/lu";

import { Alert } from "@/components/ui/alert";
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot
} from "@/components/ui/dialog";

const NameTable = ({
  finalResult,
  selectedColumn,
  uploadResult,
  setFinalResult,
  setUploadResult
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>();
  const { open, onClose, onOpen } = useDisclosure();
  const { t } = useTranslation();
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>{t("taxon:name_matching.species_name")}</th>
          <th>{t("taxon:name_matching.name_matches")}</th>
        </tr>
      </thead>
      <tbody>
        {finalResult &&
          finalResult.map((item, index) => (
            <tr>
              <td>
                <SimpleActionButton
                  onClick={() => {
                    setCurrentIndex(index);
                    onOpen();
                  }}
                  icon={<LuDelete />}
                  title={"Delete Scientific Name"}
                  colorPalette="red"
                />
                <DialogRoot open={open} onOpenChange={onClose}>
                  <DialogBackdrop>
                    <DialogContent>
                      <DialogHeader fontSize="lg" fontWeight="bold">
                        🗑️ {t("taxon:name_matching.delete_title")}
                      </DialogHeader>
                      <DialogBody>{t("taxon:name_matching.delete_description")}</DialogBody>

                      <DialogFooter>
                        <Button onClick={onClose}>{t("taxon:name_matching.cancel")}</Button>
                        <Button
                          colorScheme="red"
                          onClick={() => {
                            if (currentIndex != undefined) {
                              setUploadResult(
                                uploadResult.filter((_, i) => i != finalResult[currentIndex][4])
                              );
                              setFinalResult(finalResult.filter((_, i) => i !== currentIndex));
                              onClose();
                            }
                          }}
                          ml={3}
                        >
                          {t("taxon:name_matching.delete")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogBackdrop>
                </DialogRoot>
                {selectedColumn !== null && item[0]?.slice(0, -1).split("|")[selectedColumn]}
              </td>
              <td>
                {item[3] == false && (
                  <>
                    <Text m={4}>
                      <Image
                        boxSize="2.2rem"
                        objectFit="contain"
                        src={getLocalIcon(item[1]?.group_name)}
                        alt={item[1]?.group_name}
                        // ignoreFallback={true}
                      />
                      {item[1]?.name}
                      <Badge ml={2}>{item[1]?.rank}</Badge>
                      <Badge ml={2} colorScheme={TAXON_BADGE_COLORS[item[1]?.status]}>
                        {item[1]?.status}
                      </Badge>
                      <Badge ml={2} colorScheme={TAXON_BADGE_COLORS[item[1]?.position]}>
                        {item[1]?.position}
                      </Badge>
                      {uploadResult[item[4]][1].length > 1 && (
                        <Text float="right" color="green.700" fontWeight="bold">
                          {`${uploadResult[item[4]][1].length}  ${t(
                            "taxon:name_matching.multiple_matches"
                          )}`}
                          <IconButton
                            ml={2}
                            color="teal"
                            cursor="pointer"
                            onClick={() => {
                              const updatedMatching = [...finalResult];
                              updatedMatching[index][3] = true;
                              setFinalResult(updatedMatching);
                            }}
                          >
                            <LuPencil />
                          </IconButton>
                        </Text>
                      )}
                      {uploadResult[item[4]][1].length == 1 && (
                        <Text float="right" color="green.700" fontWeight="bold">
                          {t("taxon:name_matching.one_match")}
                        </Text>
                      )}
                      {uploadResult[item[4]][1].length == 0 && (
                        <Text float="right" color="red.700" fontWeight="bold">
                          {t("taxon:name_matching.no_match")}
                        </Text>
                      )}
                    </Text>
                    {item[1]?.hierarchy && (
                      <Box p={2} px={4} mb={4} className="white-box fadeInUp delay-2">
                        <Text maxWidth="100%">
                          {item[1]?.hierarchy.map((name) => name["taxon_name"]).join(" / ")}
                        </Text>
                      </Box>
                    )}
                  </>
                )}
                {item[2] && item[3] == false && (
                  <Alert bg="blue.50">
                    <Text>{t("taxon:name_matching.species_page_exist")}</Text>
                  </Alert>
                )}
                {!item[2] && item[3] == false && uploadResult[item[4]][1].length != 0 && (
                  <Alert bg="red.500" color="white">
                    <Text>{t("taxon:name_matching.no_species_page")}</Text>
                  </Alert>
                )}
                {item[3] == true && (
                  <Box>
                    {uploadResult &&
                      uploadResult[item[4]][1].map((option) => (
                        <Box
                          padding={4}
                          _hover={{
                            bg: "lightgrey"
                          }}
                          cursor="pointer"
                          onClick={async () => {
                            const updatedMatching = [...finalResult];
                            updatedMatching[index][1] = option;
                            const { success, data } = await axCheckSpecies(option["id"]);
                            if (success) {
                              updatedMatching[index][2] = data;
                            } else {
                              updatedMatching[index][2] = null;
                            }
                            updatedMatching[index][3] = false;
                            setFinalResult(updatedMatching);
                          }}
                        >
                          {option["name"]}
                          <Badge ml={2}>{option["rank"]}</Badge>
                          <Badge ml={2} colorScheme={TAXON_BADGE_COLORS[option["status"]]}>
                            {option["status"]}
                          </Badge>
                          <Badge ml={2} colorScheme={TAXON_BADGE_COLORS[option["position"]]}>
                            {option["position"]}
                          </Badge>
                          {option["id"] == item[1]?.id && (
                            <Badge ml={2} colorScheme="blue">
                              {"Selected"}
                            </Badge>
                          )}
                        </Box>
                      ))}
                  </Box>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default NameTable;
