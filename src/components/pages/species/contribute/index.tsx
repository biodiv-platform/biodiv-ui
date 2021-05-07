import { Box, Button, ListItem, OrderedList } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config.json";
import useTranslation from "@hooks/use-translation";
import AddIcon from "@icons/add";
import DownloadIcon from "@icons/download";
import MailIcon from "@icons/mail";
import PeopleIcon from "@icons/people";
import React from "react";

export default function SpeciesContributePageComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <Box mb={4} as="p">
        {t("SPECIES.CONTRIBUTE.DESCRIPTION")}
      </Box>
      <OrderedList>
        <ListItem>
          <b>{t("SPECIES.CONTRIBUTE.ONLINE.TITLE")}</b>
          {t("SPECIES.CONTRIBUTE.ONLINE.DESCRIPTION")}
          <Box my={4}>
            <LocalLink href="/species/taxonBrowser">
              <Button colorScheme="blue" leftIcon={<PeopleIcon />} mr={4} as="a">
                {t("SPECIES.CONTRIBUTE.REQUEST_PERMISSION")}
              </Button>
            </LocalLink>
            <LocalLink href="/species/create">
              <Button colorScheme="blue" leftIcon={<AddIcon />} as="a">
                {t("SPECIES.CONTRIBUTE.CREATE_SPECIES")}
              </Button>
            </LocalLink>
          </Box>
        </ListItem>

        <ListItem>
          <b>{t("SPECIES.CONTRIBUTE.OFFLINE.TITLE")}</b>
          {t("SPECIES.CONTRIBUTE.OFFLINE.DESCRIPTION")}
          <Box my={4}>
            <Button colorScheme="blue" leftIcon={<DownloadIcon />} mr={4}>
              {t("SPECIES.CONTRIBUTE.DOWNLOAD")}
            </Button>
            <Button
              as="a"
              href={SITE_CONFIG.FOOTER.SOCIAL.MAIL.URL}
              colorScheme="blue"
              leftIcon={<MailIcon />}
            >
              {t("SPECIES.CONTRIBUTE.EMAIL")}
            </Button>
          </Box>
        </ListItem>
      </OrderedList>
    </div>
  );
}
