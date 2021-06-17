import React from "react";

import ExternalBlueLink from "./external";

export default function ExternalBlueLinkList({ hrefs }: { hrefs?: string[] }) {
  return (
    <>
      {hrefs?.map((href) => (
        <ExternalBlueLink key={href} href={href.trim()} />
      ))}
    </>
  );
}
