import ogs from "open-graph-scraper";

export default async function handler(req, res) {
  const options = { url: req.query.url };
  const { result } = await ogs(options);

  res.json({
    href: req.query.url,
    title: result.ogTitle,
    image: result.ogImage?.[0]?.url,
    description: result.ogDescription
  });
}
