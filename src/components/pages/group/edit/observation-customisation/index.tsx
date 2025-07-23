import React from "react";

import ObservationCustomizationForm from "./form";

export default function ObservationCustomizations({ userGroupId, mediaToggle }) {
  return <ObservationCustomizationForm userGroupId={userGroupId} mediaToggle={mediaToggle} />;
}
