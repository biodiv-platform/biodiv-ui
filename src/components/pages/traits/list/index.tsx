import { Box, Flex, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import BlueLink from "@components/@core/blue-link";
import BoxHeading from "@components/@core/layout/box-heading";
import LocalLink, { useLocalRouter } from "@components/@core/local-link";
import { SelectInputField } from "@components/form/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { CATEGORY_TYPE } from "@static/constants";
import { getTraitIcon } from "@utils/media";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";

export default function TraitsListComponent({ data, filterKey }) {
  const router = useLocalRouter();
  const hForm = useForm<any>({
    defaultValues: {
      filter: filterKey
    },
    resolver: yupResolver(
      Yup.object().shape({
        filter: Yup.string().required()
      })
    )
  });

  // ✅ Define groupedData type to prevent "unknown" errors
  const groupedData: Record<string, { categoryName: string; traitsValuePairList: any[] }[]> = {};

  const applyFilter = (category) => {
    router.push("/traits/list", true, { filter: category }, true);
  };

  // ✅ Build groupedData correctly
  data.forEach((item) => {
    const [mainCategory, subCategory] = item.categoryName.split(" > ");

    if (!groupedData[mainCategory]) {
      groupedData[mainCategory] = [];
    }

    groupedData[mainCategory].push({
      categoryName: subCategory,
      traitsValuePairList:
        filterKey === "All"
          ? item.traitsValuePairList
          : item.traitsValuePairList.filter(
              (i) => i.traits.showInObservation === (filterKey === "Species" ? false : true)
            )
    });
  });

  return (
    <div className="container mt">
      <FormProvider {...hForm}>
        <form>
          <Box mb={4} width="100%">
            <SelectInputField
              key={`Category`}
              name={"filter"}
              label={"Category"}
              options={CATEGORY_TYPE}
              onChangeCallback={(value) => applyFilter(value)}
              isRequired={true}
            />
          </Box>
        </form>
      </FormProvider>

      <Box>
        {Object.entries(groupedData).map(([mainCategory, subCategories]) => (
          <Box className="white-box" key={mainCategory} mb={4} bgColor={"#e6e9ec"}>
            <BoxHeading styles={{ display: "flex", justifyContent: "space-between" }}>
              {mainCategory}
            </BoxHeading>
            <Box m={4} ml={4} bgColor={"##e6e9ec"}>
              {Array.isArray(subCategories) &&
                subCategories.map((subCategory, index) => (
                  <Box key={`${subCategory.categoryName}-${index}`}>
                    {subCategory.traitsValuePairList.length !== 0 && (
                      <BoxHeading>{subCategory.categoryName}</BoxHeading>
                    )}
                    {subCategory.traitsValuePairList.map((trait, traitIndex) => (
                      <Box key={`trait-${traitIndex}`} m={2} className="white-box">
                        <Heading as="h4" size="sm" mb={2} alignItems="center" display="flex" m={2}>
                          <LocalLink
                            href={`/traits/show/${trait.traits?.traitId}`}
                            prefixGroup={true}
                          >
                            <BlueLink mr={2}>
                              {trait.traits?.name}{" "}
                              {trait.traits?.units && `(${trait.traits.units})`}
                            </BlueLink>
                          </LocalLink>
                        </Heading>
                        <Box m={2}>
                          Category: {trait.traits.showInObservation ? "Observation" : "Species"}
                        </Box>
                        <Box m={2}>Datatype: {trait.traits.dataType}</Box>
                        <SimpleGrid columns={{ md: 3 }} spacing={4} m={2}>
                          {trait.values.map((value) => (
                            <Flex
                              key={value.id}
                              alignItems="center"
                              border="2px"
                              borderColor="gray.200"
                              borderRadius="md"
                              lineHeight={1}
                              p={2}
                              h="3.25rem"
                            >
                              {value?.icon && (
                                <Image
                                  objectFit="contain"
                                  boxSize="32px"
                                  mr={2}
                                  src={getTraitIcon(value?.icon)}
                                  alt={value.value}
                                  ignoreFallback={true}
                                />
                              )}
                              <div>{value.value}</div>
                            </Flex>
                          ))}
                        </SimpleGrid>
                      </Box>
                    ))}
                  </Box>
                ))}
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
}
