import HTMLContainer from "@components/@core/html-container";
import { useLocalRouter } from "@components/@core/local-link";
import { getInjectableHTML } from "@utils/text";
import React, { useEffect, useState } from "react";

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
    <HTMLContainer
      dangerouslySetInnerHTML={{
        __html: getInjectableHTML(nHtml)
      }}
    />
  );
};

export default CommentRender;
