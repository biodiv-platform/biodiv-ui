import { useLocalRouter } from "@components/@core/local-link";
import React, { useEffect } from "react";

export default function Recreate() {
  const { push } = useLocalRouter();

  useEffect(() => {
    push("/observation/create", true);
  });

  return <div>Loading...</div>;
}
