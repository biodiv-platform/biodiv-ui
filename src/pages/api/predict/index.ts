import SITE_CONFIG from "@configs/site-config";
import { plainHttp } from "@utils/http";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const response = await plainHttp.post(SITE_CONFIG.OBSERVATION.PREDICT.ENDPOINT, req.body);
  res.json(response.data);
}
