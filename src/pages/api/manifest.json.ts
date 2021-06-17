import SITE_CONFIG from "@configs/site-config";
import { APP_VERSION, RESOURCE_SIZE } from "@static/constants";
import { compiledMessage } from "@utils/basic";

const getIcon = (p) => ({
  src: compiledMessage(RESOURCE_SIZE.MANIFEST, p).replace("/crop/", "/logo/"),
  sizes: `${p.size}x${p.size}`,
  type: "image/png",
  purpose: "any maskable"
});

export default (req, res) => {
  const {
    query: { name, icon }
  } = req;

  res.json({
    name,
    short_name: name.toLowerCase(),
    version: APP_VERSION,
    manifest_version: 2,
    description: SITE_CONFIG.SITE.DESCRIPTION,
    background_color: "#ffffff",
    theme_color: "#363636",
    display: "standalone",
    start_url: "/",
    icons: [getIcon({ icon, size: 192 }), getIcon({ icon, size: 512 })]
  });
};
