import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input
} from "@chakra-ui/react";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import dayjs from "@utils/date";
import Head from "next/head";
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
  const { filter, setFilter } = useObservationFilter();
  const defaultDate = useMemo(() => {
    if (filter && filter[filterKey.min]) {
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

        // If no max is selected then by default it will add 1 day (end of day) and shows results
        _draft.f[filterKey.max] = dates[1]
          ? dayjs(dates[1]).utc().format()
          : dayjs(dates[0]).add(1, "day").utc().format();
      } else {
        _draft.f[filterKey.min] = undefined;
        _draft.f[filterKey.max] = undefined;
      }
      _draft.f.offset = 0;
    });
    console.debug(dates);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/flatpickr/dist/themes/material_blue.css"
          key="flatpickr"
        />
      </Head>
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
              <Input
                {...props}
                placeholder={t(translateKey)}
                defaultValue={defaultValue}
                ref={ref}
              />
            )}
          />
        </AccordionPanel>
      </AccordionItem>
    </>
  );
}
