import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/core";
import { useLocalRouter } from "@components/@core/local-link";
import CheckboxGroup from "@components/form/checkboxGroup";
import Submit from "@components/form/submit-button";
import TextBoxField from "@components/form/text";
import useTranslation from "@configs/i18n/useTranslation";
import { Role } from "@interfaces/custom";
import { axObservationFilterDownload } from "@services/observation.service";
import { observationFilterList } from "@static/observationFiltersList";
import { hasAccess } from "@utils/auth";
import notification, { NotificationType } from "@utils/notification";
import { encode } from "base64-url";
import { useStoreState } from "easy-peasy";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

export default function DownLoadFilterModal({ traits, customFields }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useStoreState((s) => s.user);
  const { t } = useTranslation();
  const { push, asPath } = useLocalRouter();
  const hform = useForm({
    mode: "onSubmit",
    validationSchema: Yup.object().shape({
      notes: Yup.string().required()
    })
  });
  (observationFilterList["traits"] = traits),
    (observationFilterList["customFields"] = customFields);
  const observationFilterTypes = Object.keys(observationFilterList);

  const handleOpen = () => {
    !hasAccess([Role.Admin, Role.User])
      ? push("/login", true, { forward: encode(asPath) })
      : onOpen();
  };

  const handleDownload = async (filterData) => {
    try {
      const params = {
        authorid: id,
        notes: filterData.notes,
        customfields: filterData?.customFields?.toString() || "",
        taxonomic: filterData?.taxonomic?.toString() || "",
        spatial: filterData?.spatial?.toString() || "",
        traits: filterData?.traits?.toString() || "",
        temporal: filterData?.temporal?.toString() || "",
        misc: filterData?.misc?.toString() || ""
      };
      await axObservationFilterDownload("extended_observation", "extended_records", params);
      notification(t("OBSERVATION.DOWNLOAD_FILTER_SUCCESS"), NotificationType.Success);
      onClose();
    } catch (err) {
      notification(t("OBSERVATION.DOWNLOAD_FILTER_ERROR"), NotificationType.Error);
      onClose();
    }
  };

  return (
    <>
      <Button color="green.500" onClick={handleOpen}>
        Download
      </Button>
      <Modal isOpen={isOpen} size="50rem" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose Columns</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={hform.handleSubmit(handleDownload)}>
            <ModalBody>
              {observationFilterTypes.map((item, index) =>
                index == 0 ? (
                  <Box key={index} bg="gray.100">
                    <CheckboxGroup
                      form={hform}
                      list={observationFilterList[item]}
                      name={item}
                      isReadOnly={true}
                      label={item}
                    />
                  </Box>
                ) : (
                  <Box key={index}>
                    <CheckboxGroup
                      key={index}
                      form={hform}
                      list={observationFilterList[item]}
                      name={item}
                      label={item}
                    />
                  </Box>
                )
              )}
              <TextBoxField
                isRequired={true}
                label={t("OBSERVATION.FILTER_DOWNLOAD_NOTES")}
                placeholder={t("OBSERVATION.FILTER_DOWNLOAD_MODAL")}
                name="notes"
                form={hform}
              />
            </ModalBody>
            <ModalFooter>
              <Submit form={hform} variantColor="blue">
                Download
              </Submit>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
