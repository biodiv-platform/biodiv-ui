import { Box, Button, ListItem, OrderedList } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import DownloadIcon from "@icons/download";
import MailIcon from "@icons/mail";
import PeopleIcon from "@icons/people";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SpeciesContributePageComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <Box mb={4} as="p">
        {t("species:contribute.description")}
      </Box>
      <OrderedList>
        <ListItem>
          <b>{t("species:contribute.online.title")}</b>
          {t("species:contribute.online.description")}
          <Box my={4}>
            <LocalLink href="/roles/request">
              <Button colorScheme="blue" leftIcon={<PeopleIcon />} mr={4} as="a">
                {t("species:contribute.request_permission")}
              </Button>
            </LocalLink>
            <LocalLink href="/species/create">
              <Button colorScheme="blue" leftIcon={<AddIcon />} as="a">
                {t("species:contribute.create_species")}
              </Button>
            </LocalLink>
          </Box>
        </ListItem>

        <ListItem>
          <b>{t("species:contribute.offline.title")}</b>
          {t("species:contribute.offline.description")}
          <Box my={4}>
            <Button
              as="a"
              href="/biodiv/content/SimpleSpeciesPagesTemplateWithExample.xlsx"
              colorScheme="blue"
              leftIcon={<DownloadIcon />}
              mr={4}
            >
              {t("species:contribute.download")}
            </Button>
            <Button
              as="a"
              href={SITE_CONFIG.FOOTER.SOCIAL.MAIL.URL}
              colorScheme="blue"
              leftIcon={<MailIcon />}
            >
              {t("species:contribute.email")}
            </Button>
          </Box>
        </ListItem>
      </OrderedList>
    </div>
  );
}
