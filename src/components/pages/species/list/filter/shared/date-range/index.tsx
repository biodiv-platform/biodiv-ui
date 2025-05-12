import "flatpickr/dist/themes/material_blue.css";

import { Box, Input } from "@chakra-ui/react";
import dayjs from "@utils/date";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import Flatpickr from "react-flatpickr";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger
} from "@/components/ui/accordion";

import useSpeciesList from "../../../use-species-list";
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
  const { filter, setFilter } = useSpeciesList();
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
    <AccordionItem value="time" pl={4} pr={4}>
      <AccordionItemTrigger>
        <Box flex={1} textAlign="left">
          {t(translateKey)}
        </Box>
      </AccordionItemTrigger>
      <AccordionItemContent>
        <Flatpickr
          options={options}
          onChange={handleOnDateChange}
          render={({ defaultValue, value, ...props }, ref) => (
            <Input {...props} placeholder={t(translateKey)} defaultValue={defaultValue} ref={ref} />
          )}
        />
      </AccordionItemContent>
    </AccordionItem>
  );
}
