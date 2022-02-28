import SITE_CONFIG from "@configs/site-config";
import { axUnsubscribeUser } from "@services/user.service";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";

import UnsubscribeScreen from "./screen";

export const UNSUB_SCREENS = {
  LANDING: 1,
  SUCCESS: 2,
  ERROR: 3
};

export default function UserUnsubscribePageComponent() {
  const { t } = useTranslation();
  const router = useRouter();

  const [screen, setScreen] = useState(UNSUB_SCREENS.LANDING);
  const [unsubscribeError, setUnsubscribeError] = useState(t("user:unsubscribe.error.description"));

  const handleOnUnsubscribeClicked = async () => {
    const { success, data } = await axUnsubscribeUser(router.query.url);
    if (success) {
      setScreen(UNSUB_SCREENS.SUCCESS);
    } else {
      setUnsubscribeError(data);
      setScreen(UNSUB_SCREENS.ERROR);
    }
  };

  const handleOnHome = () => router.push("/");

  const handleOnContactUs = () =>
    window.open(
      `${SITE_CONFIG.FOOTER.SOCIAL.MAIL.URL}?subject=${unsubscribeError}&body=${router.query.url}`
    );

  switch (screen) {
    case UNSUB_SCREENS.LANDING:
      return (
        <UnsubscribeScreen
          onClick={handleOnUnsubscribeClicked}
          icon="/next-assets/icons/unsub-info.svg"
          title={t("user:unsubscribe.landing.title")}
          description={t("user:unsubscribe.landing.description")}
          buttonText={t("user:unsubscribe.landing.confirm")}
        />
      );

    case UNSUB_SCREENS.SUCCESS:
      return (
        <UnsubscribeScreen
          onClick={handleOnHome}
          icon="/next-assets/icons/unsub-success.svg"
          title={t("user:unsubscribe.success.title")}
          description={t("user:unsubscribe.success.description")}
          buttonText={t("user:unsubscribe.success.home")}
        />
      );

    default:
      return (
        <UnsubscribeScreen
          onClick={handleOnContactUs}
          icon="/next-assets/icons/unsub-error.svg"
          title={t("user:unsubscribe.error.title")}
          description={unsubscribeError}
          buttonText={t("user:unsubscribe.error.contact_us")}
        />
      );
  }
}
