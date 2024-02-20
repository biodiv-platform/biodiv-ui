import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { axGetOpenGraphMeta } from "@services/api.service";
import { getLinkCard, preProcessContent } from "@utils/pages";
import React, { useEffect } from "react";

export function Content({ html }) {
  const getCards = async () => {
    document.querySelectorAll(".epc").forEach(async (el: any) => {
      console.warn("el.href", el.href);

      const { success, data } = await axGetOpenGraphMeta(el.href);
      console.warn("Content", data);
      if (success) {
        el.outerHTML = getLinkCard(data, el.id);
      }
    });
  };

  useEffect(() => {
    getCards();
  }, [html]);

  return (
    <Prose>
      <div className="article" dangerouslySetInnerHTML={{ __html: preProcessContent(html) }} />
    </Prose>
  );
}
