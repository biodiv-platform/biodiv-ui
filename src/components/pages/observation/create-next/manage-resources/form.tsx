import { AspectRatio, Box, Button, ButtonGroup, Flex, Image } from "@chakra-ui/react";
import { SelectInputField } from "@components/form/select";
import { TextBoxField } from "@components/form/text";
import useGlobalState from "@hooks/use-global-state";
import { getFallbackByMIME } from "@utils/media";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { LuMoveDown, LuMoveUp } from "react-icons/lu";

import { DialogBody, DialogFooter } from "@/components/ui/dialog";

import { getImageThumb } from "../../create/form/uploader/observation-resources/resource-card";
import useObservationCreateNext from "../use-observation-create-next-hook";

export default function ManageResourcesForm({ index, resources, onClose }) {
  const { user } = useGlobalState();
  const { t } = useTranslation();
  const { licensesList } = useObservationCreateNext();

  return (
    <>
      <DialogBody pt={0}>
        <Box>
          {resources.fields.map((field: any, idx) => {
            const imgThumb = useMemo(
              () => ({
                key: field.id,
                src: getImageThumb(field, user?.id),
                fallbackSrc: getFallbackByMIME(field?.["type"])
              }),
              [field.id]
            );

            return (
              <Box key={field.id} w="396px" mb={4} className="fade white-box" p={4} bg="gray.50">
                <Flex gap={4} w="full">
                  <AspectRatio minW="150px" ratio={1}>
                    <Image borderRadius="md" src={imgThumb.src} alt={imgThumb.fallbackSrc} />
                  </AspectRatio>
                  <Box>
                    <SelectInputField
                      name={`o.${index}.resources.${idx}.licenseId`}
                      options={licensesList}
                      shouldPortal={true}
                    />
                    <TextBoxField
                      label={t("observation:contributor")}
                      showLabel={false}
                      name={`o.${index}.resources.${idx}.contributor`}
                    />
                    <ButtonGroup gap={4}>
                      <Button
                        variant="outline"
                        colorPalette="blue"
                        disabled={idx === 0}
                        onClick={() => resources.move(idx, idx - 1)}
                      >
                        <LuMoveUp />
                        {t("common:move.up")}
                      </Button>
                      <Button
                        variant="outline"
                        colorPalette="blue"
                        disabled={idx === resources.fields.length - 1}
                        onClick={() => resources.move(idx, idx + 1)}
                      >
                        <LuMoveDown />
                        {t("common:move.down")}
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </Box>
      </DialogBody>

      <DialogFooter>
        <Button onClick={onClose}>{t("common:close")}</Button>
      </DialogFooter>
    </>
  );
}
