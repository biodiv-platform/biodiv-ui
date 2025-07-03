import { Box } from "@chakra-ui/react";
import useUserListFilter from "@components/pages/user/common/use-user-filter";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot
} from "@/components/ui/accordion";

import EmailFilter from "./email";
import InstituteFilter from "./institute";
import Location from "./location/map-area";
import UserFilter from "./name-of-user";
import PhoneNumberFilter from "./phone";
import ProfessionFilter from "./profession";
import RolesFilter from "./role";
import SexTypeFilter from "./sex-type";
import TimeFilter from "./time";
import UserGroupFilter from "./user-group";
import UserNameFilter from "./username";

export default function FiltersList() {
  const { t } = useTranslation();
  const { isAdmin } = useUserListFilter();

  return (
    <AccordionRoot multiple={true} lazyMount defaultValue={["location"]}>
      <AccordionItem value="location">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:location.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <Location />
        </AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="time">
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left" pl={4}>
            {t("filters:time.title")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <TimeFilter />
        </AccordionItemContent>
      </AccordionItem>

      <SexTypeFilter />

      {isAdmin && <EmailFilter />}

      <InstituteFilter />

      {isAdmin && <PhoneNumberFilter />}

      <ProfessionFilter />

      <RolesFilter />

      {isAdmin && <UserNameFilter />}

      <AccordionItem value="user" pl={4}>
        <AccordionItemTrigger pr={4}>
          <Box flex={1} textAlign="left">
            {t("filters:user.name_of_user")}
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent pr={4}>{<UserFilter filterKey="user" />}</AccordionItemContent>
      </AccordionItem>
      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
    </AccordionRoot>
  );
}
