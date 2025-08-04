import { Box, Button, Circle, Flex, Grid, GridItem, Icon, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function Wizard({steps, currentStep, setCurrentStep}) {
  const { t } = useTranslation();
  return (
    <Box mb={8}>
        <Grid
          templateColumns={`repeat(${steps.length}, 1fr)`} // icon, arrow, icon, arrow...
          gap={0}
          alignItems="center"
        >
          {/* === ICONS AND ARROWS === */}
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;

            const bgColor = isActive ? "blue.600" : "white";

            const borderColor = isActive ? "blue.600" : "gray.300";

            const iconColor = isActive ? "white" : "gray.400";

            return (
              <>
                {/* Step Icon */}
                <GridItem key={`icon-${index}`} colSpan={1}>
                  <Flex justify="center" align="center" w="100%">
                    <Circle
                      as={Button}
                      onClick={() => setCurrentStep(index)}
                      size="48px"
                      border="2px solid"
                      borderColor={borderColor}
                      bg={bgColor}
                      color={iconColor}
                      _hover={{
                        borderColor: "blue.400",
                        bgColor: "blue.400",
                        color: "white"
                      }}
                    >
                      {<Icon as={StepIcon} boxSize={4} />}
                    </Circle>
                  </Flex>
                </GridItem>
              </>
            );
          })}

          {/* === LABELS === */}
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const textColor = isActive ? "blue.600" : "black.500";

            return (
              <>
                <GridItem key={`label-${index}`} colSpan={1} mt={2} textAlign="center">
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {t(step.translation)}
                  </Text>
                </GridItem>
              </>
            );
          })}
        </Grid>
      </Box>
  );
}