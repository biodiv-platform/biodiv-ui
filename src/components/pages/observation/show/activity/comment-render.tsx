import { useLocalRouter } from "@components/@core/local-link";
import { getInjectableHTML } from "@utils/text";
import React, { useEffect, useState } from "react";

import { Prose } from "@/components/ui/prose";

const userMatch = /@\[([^\]]+?)\]\((\d+)\)/gm;

const CommentRender = ({ html }) => {
  const { link } = useLocalRouter();
  const [nHtml, setNHtml] = useState(html);

  useEffect(() => {
    let preNHtml = html;
    let m;
    while ((m = userMatch.exec(html)) !== null) {
      preNHtml = preNHtml.replace(
        m[0],
        `<a class="mention-link" href="${link(`/user/show/${m[2]}`, true)}">${m[1]}</a>`
      );
    }
    setNHtml(preNHtml);
  }, []);

  return (
    <Prose>
      <div dangerouslySetInnerHTML={{ __html: getInjectableHTML(nHtml) }} />
    </Prose>
  );
};

export default CommentRender;
