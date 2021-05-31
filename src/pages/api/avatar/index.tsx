import Avatar from "boring-avatars";
import React from "react";
import ReactDOMServer from "react-dom/server";

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { s, t } = req.query;

  const avatarHtml = ReactDOMServer.renderToString(
    <Avatar
      size={s}
      name={t}
      variant="beam"
      colors={["#A3A948", "#EDB92E", "#F85931", "#CE1836", "#009989"]}
    />
  );
  res.setHeader("Content-Type", "image/svg+xml");
  res.end(avatarHtml);
}
