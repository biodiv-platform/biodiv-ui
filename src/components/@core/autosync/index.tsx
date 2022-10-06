import { setupDB } from "@utils/db";
import React, { useEffect } from "react";

import OfflineSync from "./offline-sync";

export default function AutoSync() {
  useEffect(() => {
    setupDB();
  }, []);

  return <OfflineSync />;
}
