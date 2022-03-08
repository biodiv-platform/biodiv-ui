import "flatpickr/dist/themes/material_blue.css";

import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input
} from "@chakra-ui/react";
import useUserListFilter from "@components/pages/user/common/use-user-filter";
import dayjs from "@utils/date";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import Flatpickr from "react-flatpickr";

interface MinMaxKey {
  min: any;
  max: any;
}

interface DateRangeFilterProp {
  filterKey: MinMaxKey;
  translateKey: string;
}

export default function DateRangeFilter({ filterKey, translateKey }: DateRangeFilterProp) {
  const { t } = useTranslation();
  const { filter, setFilter } = useUserListFilter();
  const defaultDate = useMemo(() => {
    if (filter[filterKey.min]) {
      return [
        dayjs(filter[filterKey.min]).toDate(),
        filter[filterKey.max] ? dayjs(filter[filterKey.max]).toDate() : "today"
      ];
    }
  }, []);

  const options = {
    defaultDate: defaultDate,
    allowInput: true,
    maxDate: "today",
    dateFormat: "d-m-Y",
    mode: "range"
  };

  const handleOnDateChange = (dates = []) => {
    setFilter((_draft) => {
      if (dates.length > 0) {
        _draft.f[filterKey.min] = dayjs(dates[0]).utc().format();
        _draft.f[filterKey.max] = dayjs(dates[1]).utc().format();
      } else {
        _draft.f[filterKey.min] = undefined;
        _draft.f[filterKey.max] = undefined;
      }
    });
    console.debug(dates);
  };

  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex={1} textAlign="left">
          {t(translateKey)}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Flatpickr
          options={options}
          onChange={handleOnDateChange}
          render={({ defaultValue, value, ...props }, ref) => (
            <Input {...props} placeholder={t(translateKey)} defaultValue={defaultValue} ref={ref} />
          )}
        />
      </AccordionPanel>
    </AccordionItem>
  );
}
