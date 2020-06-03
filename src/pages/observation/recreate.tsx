import { useLocalRouter } from "@components/@core/local-link";
import React, { useEffect } from "react";

function RecreatePage() {
  const { push } = useLocalRouter();

  useEffect(() => {
    push("/observation/create", true);
  });

  return <div>Loading...</div>;
}

RecreatePage.config = {
  header: false,
  footer: false
};

export default RecreatePage;
