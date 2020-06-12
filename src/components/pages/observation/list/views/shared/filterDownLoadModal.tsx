import React from "react";
import { useForm } from "react-hook-form";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    ModalBody,
    ModalCloseButton,
    Button,
    Box
} from "@chakra-ui/core";
import CheckboxGroup from "@components/form/checkboxGroup";
import { observationFilterList } from "@static/observationFiltersList";

export default function BasicUsage({ traits, customFields }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const hform = useForm();
    (observationFilterList["traits"] = traits),
        (observationFilterList["customFields"] = customFields);
    const observationFilterTypes = Object.keys(observationFilterList);
    const handleClick = () => {
        return true;
    };

    return (
        <>
            <Button color="green.500" onClick={onOpen}>
                Download
      </Button>
            <Modal isOpen={isOpen} size="50rem" onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose Columns</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {observationFilterTypes.map(
                            (item, index) =>
                                index == 0 ? (
                                    <Box bg="gray.100" p={[5]}>
                                        <CheckboxGroup

                                            key={index}
                                            form={hform}
                                            list={observationFilterList[item]}
                                            name={item}
                                            isReadOnly={true}
                                            label={item} />
                                    </Box>

                                ) : (
                                        <CheckboxGroup
                                            key={index}
                                            form={hform}
                                            list={observationFilterList[item]}
                                            name={item}
                                            label={item}
                                        />
                                    )
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variantColor="blue" mr={3} onClick={onClose}>
                            Close
            </Button>
                        <Button variant="ghost" onClick={handleClick}>
                            Secondary Action
            </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
