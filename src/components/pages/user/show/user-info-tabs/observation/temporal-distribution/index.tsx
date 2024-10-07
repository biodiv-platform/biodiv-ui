import { Skeleton } from "@chakra-ui/react";
import React from "react";

import TemporalCreatedOn from "./temporal-created-on";
import useTemporalData from "./use-temporal-observation-data";
import UserTemporalObservedOn from "./user-temporal-observed-on";

export default function TemporalDistribution(userId) {
  const temporalData = useTemporalData(userId.userId);

  const data = temporalData.data.list;
  const isLoading = temporalData.data.isLoading;
  if (isLoading) {
    return <Skeleton h={450} borderRadius="md" />;
  }

  if (!data) {
    return <div></div>;
  }

  return (
    <div>
      <TemporalCreatedOn data={data["createdOn"]}/>
      <UserTemporalObservedOn data={data["observedOn"]}/>
    </div>
  );
}