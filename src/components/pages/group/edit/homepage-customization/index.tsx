import React from "react";

import HomePageCustomizationForm from "./form";

export default function GroupHomePageCustomization({
  userGroupId,
  homePageDetails,
  currentStep,
  languages
}) {
  return (
    <HomePageCustomizationForm
      userGroupId={userGroupId}
      homePageDetails={homePageDetails}
      currentStep={currentStep}
      languages={languages}
    />
  );
}
