export default (req, res) => {
  const {
    query: { name, icon }
  } = req;

  res.json({
    name: name,
    short_name: name.toLowerCase(),
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    background_color: "#0e0e0e",
    theme_color: "#363636",
    display: "minimal-ui",
    start_url: "/",
    icons: [
      {
        src: `${icon}?h=192&w=192`,
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: `${icon}?h=512&w=512`,
        sizes: "512x512",
        type: "image/png"
      }
    ]
  });
};
