import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import useUserListFilter from "@components/pages/user/common/use-user-filter";
import SITE_CONFIG from "@configs/site-config";
import useTranslation from "next-translate/useTranslation";
import React from "react";

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
    <Accordion defaultIndex={[0]} allowMultiple={true}>
      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:location.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Location />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box flex={1} textAlign="left">
            {t("filters:time.title")}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <TimeFilter />
        </AccordionPanel>
      </AccordionItem>

      <SexTypeFilter />

      {isAdmin && <EmailFilter />}

      <InstituteFilter />

      {isAdmin && <PhoneNumberFilter />}

      <ProfessionFilter />

      <RolesFilter />

      {isAdmin && <UserNameFilter />}

      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton>
              <Box flex={1} textAlign="left">
                {t("filters:user.name_of_user")}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{isExpanded && <UserFilter filterKey="user" />}</AccordionPanel>
          </>
        )}
      </AccordionItem>
      {SITE_CONFIG.USERGROUP.ACTIVE && <UserGroupFilter />}
    </Accordion>
  );
}
