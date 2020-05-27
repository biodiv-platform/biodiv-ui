import en from "@i18n/en.json";
import fr from "@i18n/fr.json";
import flat from "flat";

import { Strings } from "./types";

const strings: Strings = {
  en: flat(en),
  fr: flat(fr)
};

export default strings;
