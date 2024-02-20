import { fetch } from "fetch-opengraph";

export default async function handler(req, res) {
  const data = await fetch(req.query.url);

  res.json({
    href: req.query.url,
    title: data.title,
    image: data.image,
    description: data.description
  });
}
