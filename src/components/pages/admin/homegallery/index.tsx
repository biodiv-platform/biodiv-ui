import {
  Box,
  Heading
} from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import HomeIcon from "@icons/home";
import ImageIcon from "@icons/image";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import Wizard from "../../common/wizard";
import HomePageGalleryCustomizationForm from "./form";

const steps = [
  {
    label: "Homepage Components",
    translation: "group:homepage_customization.title",
    icon: HomeIcon
  },
  {
    label: "Main Gallery",
    translation: "group:homepage_customization.gallery_setup.title",
    icon: ImageIcon
  },
  {
    label: "Mini Gallery",
    translation: "group:homepage_customization.mini_gallery_setup.title",
    icon: ImageIcon
  }
];

function HomeComponent({ homeInfo, languages }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="container mt">
      <PageHeading> 🧰 {t("group:homepage_customization.title")}</PageHeading>
      <Wizard steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
      <Box p={6} rounded="lg" border="1px solid" borderColor="gray.200" boxShadow="sm" mb={4}>
        <Heading as="h2" fontSize={22} fontWeight="bold" color="gray.900" mb={2}>
          {t(steps[currentStep].translation)}
        </Heading>
        <HomePageGalleryCustomizationForm homePageDetails={homeInfo} languages={languages} currentStep={steps[currentStep].translation}/>
      </Box>
    </div>
  );
}

export default HomeComponent;
