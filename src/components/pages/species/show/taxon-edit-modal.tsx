import { Button } from "@chakra-ui/react";
import { SelectAsyncInputField } from "@components/form/select-async";
import {
  onScientificNameQuery,
  ScientificNameOption
} from "@components/pages/observation/create/form/recodata/scientific-name";
import { yupResolver } from "@hookform/resolvers/yup";
import { axReindexSpecies, axUpdateSpeciesTaxonId } from "@services/species.service";
import { axGetTaxonDetails } from "@services/taxonomy.service";
import notification from "@utils/notification";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { LuInfo } from "react-icons/lu";
import * as Yup from "yup";

import { SubmitButton } from "@/components/form/submit-button";
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle
} from "@/components/ui/dialog";
import CheckIcon from "@/icons/check";

interface TaxonEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  //species: any;
  //onTaxonUpdated?: () => void;
}

// interface FormValues {
//   selectedTaxon: any;
// }

const onQuery = (q) => onScientificNameQuery(q, "name");

export default function TaxonEditModal({
  isOpen,
  onClose,
 // species,
  //onTaxonUpdated
}: TaxonEditModalProps) {
  const formRef = useForm<any>({
    resolver: yupResolver(
      Yup.object().shape({
        taxon: Yup.mixed().nullable()
      })
    ),
    // defaultValues: {
    //   taoxn: []
    // }
  });

  const handleSave = async (values) => {
    console.log("values=", values);
  };
  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} size="lg" closeOnInteractOutside={false} trapFocus={false} preventScroll={false} modal={false}>
      <DialogContent>
        <FormProvider {...formRef}>
        <form onSubmit={formRef.handleSubmit(handleSave)}>
        <DialogHeader>Update Taxon</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>
          {/* <div>Hello</div> */}
          <SelectAsyncInputField
            name="taxon"
            label="taxon"
            onQuery={onQuery}
            optionComponent={ScientificNameOption}
            placeholder="search name"
            resetOnSubmit={false}
            openMenuOnFocus={true}
            style={{
              menuPortal: (base) => ({ ...base, zIndex: 10000 }),
              menu: (base) => ({ ...base, zIndex: 10000 })
            }}
          />
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <SubmitButton leftIcon={<CheckIcon />} children="saves" />
          {/* <Button ml={4} onClick={onEditClose} type="button" variant={"subtle"}>
                <CrossIcon />
                {t("common:cancel")}
              </Button> */}
        </DialogFooter>
        </form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  );

  // const { t } = useTranslation();

  // const [selectedTaxonDetails, setSelectedTaxonDetails] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [selectedTaxon, setSelectedTaxon] = useState<any>(null);

  // const methods = useForm<FormValues>({
  //   mode:"onChange",

  //   defaultValues: {
  //     selectedTaxon: null
  //   }
  // });

  // const { handleSubmit } = methods;

  // const handleTaxonSelect = async (taxon: any) => {
  //   console.log("SELECTED");
  //   setSelectedTaxon(taxon);
  //   const taxonId = taxon?.value;
  //   if (taxonId) {
  //     setIsLoading(true);
  //     try {
  //       const { data } = await axGetTaxonDetails(taxonId);
  //       setSelectedTaxonDetails(data);
  //     } catch (error) {
  //       console.error("Failed to fetch taxon details:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     setSelectedTaxonDetails(null);
  //   }
  // };

  // const onSubmit = async () => {
  //   const taxonId = selectedTaxon?.value;
  //   if (!taxonId || !species?.species?.id) return;

  //   setIsLoading(true);
  //   try {
  //     const result = await axUpdateSpeciesTaxonId(species.species.id, taxonId);

  //     if (result.success) {
  //       await axReindexSpecies(species.species.id);

  //       notification("Taxon ID updated successfully");
  //       onClose();

  //       if (onTaxonUpdated) {
  //         onTaxonUpdated();
  //       }

  //       window.location.reload();
  //     } else {
  //       notification("Failed to update taxon ID");
  //     }
  //   } catch (error) {
  //     console.error("Failed to replace taxon:", error);
  //     notification("Failed to update taxon ID");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // return (
  //   <DialogRoot open={isOpen} onOpenChange={onClose} size="cover">
  //     <DialogBackdrop />
  //     <DialogContent>
  //       <DialogHeader>
  //         <DialogTitle>Update taxon id</DialogTitle>
  //         <DialogCloseTrigger />
  //       </DialogHeader>

  //       <FormProvider {...methods}>
  //         <form onSubmit={handleSubmit(onSubmit)}>
  //           <DialogBody>
  //             <Stack gap={4}>
  //               <Box>
  //                 <Text fontSize="sm" color="gray.600" mb={2}>
  //                   Current accepted name:
  //                 </Text>
  //                 <Stack direction="row" alignItems="center" p={3} bg="gray.50" borderRadius="md">
  //                   <Text fontWeight="medium">{species?.taxonomyDefinition?.name}</Text>
  //                   <Text fontSize="sm" color="gray.600">
  //                     (ID: {species?.taxonomyDefinition?.id})
  //                   </Text>
  //                 </Stack>
  //               </Box>

  //               <Box>
  //                 <Text fontSize="sm" fontWeight="medium" mb={2}>
  //                   Search new taxon
  //                 </Text>
  //                 <SelectAsyncInputField
  //                   name="selectedTaxon"
  //                   placeholder="Type at least 3 characters..."
  //                   onQuery={onScientificNameQuery}
  //                   optionComponent={ScientificNameOption}
  //                   multiple={false}
  //                   // isCreatable={false}
  //                   //isClearable={true}
  //                   onChange={handleTaxonSelect}
  //                 />
  //               </Box>

  //               {selectedTaxonDetails && (
  //                 <Box
  //                   p={4}
  //                   bg="blue.50"
  //                   borderRadius="md"
  //                   border="1px solid"
  //                   borderColor="blue.200"
  //                 >
  //                   <Stack direction="row" alignItems="center" mb={2}>
  //                     <LuInfo color="blue" />
  //                     <Text fontWeight="medium" color="blue.800">
  //                       Selected taxon details
  //                     </Text>
  //                   </Stack>
  //                   <Stack gap={2}>
  //                     <Stack direction="row">
  //                       <Text fontWeight="medium" fontSize="sm">
  //                         Name:
  //                       </Text>
  //                       <Text fontSize="sm">{selectedTaxonDetails.name}</Text>
  //                     </Stack>
  //                     <Stack direction="row">
  //                       <Text fontWeight="medium" fontSize="sm">
  //                         Rank:
  //                       </Text>
  //                       <Text fontSize="sm">{selectedTaxonDetails.rank}</Text>
  //                     </Stack>
  //                     <Stack direction="row">
  //                       <Text fontWeight="medium" fontSize="sm">
  //                         Status:
  //                       </Text>
  //                       <Text fontSize="sm">{selectedTaxonDetails.status}</Text>
  //                     </Stack>
  //                     <Stack direction="row">
  //                       <Text fontWeight="medium" fontSize="sm">
  //                         Taxon ID:
  //                       </Text>
  //                       <Text fontSize="sm" fontFamily="mono">
  //                         {selectedTaxonDetails.id}
  //                       </Text>
  //                     </Stack>
  //                   </Stack>
  //                 </Box>
  //               )}

  //               {selectedTaxon && (
  //                 <Box
  //                   p={3}
  //                   bg="yellow.50"
  //                   borderRadius="md"
  //                   border="1px solid"
  //                   borderColor="yellow.200"
  //                 >
  //                   <Text fontSize="sm" color="yellow.800">
  //                     <strong>Warning:</strong> This will replace the current taxon with the
  //                     selected one.
  //                   </Text>
  //                 </Box>
  //               )}
  //             </Stack>
  //           </DialogBody>

  //           <DialogFooter>
  //             <DialogActionTrigger asChild>
  //               <Button variant="outline" onClick={onClose}>
  //                 Cancel
  //               </Button>
  //             </DialogActionTrigger>
  //             <Button
  //               type="submit"
  //               colorPalette="blue"
  //               loading={isLoading}
  //               disabled={!selectedTaxon?.value}
  //             >
  //               Replace Taxon
  //             </Button>
  //           </DialogFooter>
  //         </form>
  //       </FormProvider>
  //     </DialogContent>
  //   </DialogRoot>
  // );
}
