import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input
} from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
import { formatDateReverse, parseDateReverse } from "@utils/date";
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
  const { filter, setFilter } = useObservationFilter();
  const defaultDate = useMemo(() => {
    if (filter[filterKey.min]) {
      return [
        parseDateReverse(filter[filterKey.min]) || new Date(0),
        parseDateReverse(filter[filterKey.max]) || "today"
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
    if (dates.length > 1) {
      setFilter((_draft) => {
        _draft.f[filterKey.min] = formatDateReverse(dates[0]);
        _draft.f[filterKey.max] = formatDateReverse(dates[1]);
      });
    }
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
