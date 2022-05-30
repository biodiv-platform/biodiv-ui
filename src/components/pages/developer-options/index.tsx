import { Button } from "@chakra-ui/react";
import { PageHeading } from "@components/@core/layout";
import { DB_CONFIG } from "@static/observation-create";
import React from "react";

export default function DeveloperOptionsComponentPage() {
  const handleOnIndexedDBDelete = () => {
    const req = indexedDB.deleteDatabase(DB_CONFIG.databaseName);

    req.onsuccess = () => {
      alert(`IndexedDB removed successfully please login again`);
      window.location.assign("/logout");
    };

    req.onerror = () => alert("Unable to delete IndexedDB");
  };

  return (
    <div className="container mt">
      <PageHeading mb={6}>👨‍💻 Developer Options</PageHeading>

      <Button colorScheme="red" onClick={handleOnIndexedDBDelete}>
        💥 Remove IndexedDB
      </Button>
    </div>
  );
}
