import MapPageComponent from "@components/pages/map";
import React from "react";

export default function MapPage({ layers }) {
  return <MapPageComponent defaultLayers={layers} />;
}

export const getServerSideProps = async (ctx) => ({
  props: { layers: ctx.query?.layers?.split(",").filter((o) => o) || [] }
});
