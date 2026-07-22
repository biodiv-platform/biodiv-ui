import ShareIcon from "@icons/share";
import { RWebShare } from "react-web-share";

import SimpleActionButton from "./simple";

export default function ShareActionButton({ text, title }) {
  return (
    <RWebShare data={{ text, title }}>
      <SimpleActionButton icon={<ShareIcon />} title={title} colorPalette="orange" />
    </RWebShare>
  );
}
