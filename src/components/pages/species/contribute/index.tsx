import { Box, Button, List } from "@chakra-ui/react";
import LocalLink from "@components/@core/local-link";
import SITE_CONFIG from "@configs/site-config";
import AddIcon from "@icons/add";
import DownloadIcon from "@icons/download";
import MailIcon from "@icons/mail";
import PeopleIcon from "@icons/people";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SpeciesContributePageComponent() {
  const { t } = useTranslation();

  return (
    <div className="container mt">
      <Box mb={4} as="p">
        {t("species:contribute.description")}
      </Box>
      <List.Root as={"ol"}>
        <List.Item>
          <b>{t("species:contribute.online.title")}</b>
          {t("species:contribute.online.description")}
          <Box my={4}>
            <LocalLink href="/roles/request">
              <Button colorPalette="blue" mr={4} as="a">
                <PeopleIcon />
                {t("species:contribute.request_permission")}
              </Button>
            </LocalLink>
            <LocalLink href="/species/create">
              <Button colorPalette="blue" as="a">
                <AddIcon />
                {t("species:contribute.create_species")}
              </Button>
            </LocalLink>
          </Box>
        </List.Item>

        <List.Item>
          <b>{t("species:contribute.offline.title")}</b>
          {t("species:contribute.offline.description")}
          <Box my={4}>
            <Link href={"/biodiv/content/SimpleSpeciesPagesTemplateWithExample.xlsx"}>
              <Button as="a" colorPalette="blue" mr={4}>
                <DownloadIcon />
                {t("species:contribute.download")}
              </Button>
            </Link>

            <Link href={SITE_CONFIG.FOOTER.SOCIAL.MAIL.URL}>
              <Button as="a" colorPalette="blue">
                <MailIcon />
                {t("species:contribute.email")}
              </Button>
            </Link>
          </Box>
        </List.Item>
      </List.Root>
    </div>
  );
}
