import { axGetOpenGraphMeta } from "@services/api.service";
import { getLinkCard, preProcessContent } from "@utils/pages";
import React, { useEffect } from "react";

import { Prose } from "@/components/ui/prose";

export function Content({ html }) {
  const getCards = async (selector, cardType) => {
    const elements = document.querySelectorAll(selector);
    const promises = Array.from(elements).map(async (el) => {
      const { success, data } = await axGetOpenGraphMeta(el.href);
      if (success) {
        el.outerHTML = getLinkCard(data, el.id, cardType);
      }
    });
    await Promise.all(promises);
  };

  useEffect(() => {
    Promise.all([getCards(".epc", "epc"), getCards(".banner", "banner")]);
  }, [html]);

  return (
    <Prose>
      <div className="article" dangerouslySetInnerHTML={{ __html: preProcessContent(html) }} />
    </Prose>
  );
}
