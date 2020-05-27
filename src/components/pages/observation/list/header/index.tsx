import { Flex, Icon, Select, Tab, TabList, Tabs, Text } from "@chakra-ui/core";
import useTranslation from "@configs/i18n/useTranslation";
import useObservationFilter from "@hooks/useObservationFilter";
import { sortByOptions, viewTabs } from "@static/observation-list";
import { toHumanString } from "human-readable-numbers";
import React from "react";

export default function ListHeader() {
  const { filter, setFilter, observationData } = useObservationFilter();
  const defaultIndex = viewTabs.findIndex((t) => t.key === filter.view);
  const { t } = useTranslation();

  const handleOnViewChange = (index: number) => {
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.view = viewTabs[index].key;
    });
  };

  const handleOnSort = (e) => {
    const v = e?.target?.value;
    setFilter((_draft) => {
      _draft.f.offset = 0;
      _draft.f.sort = `${v}`;
    });
  };

  return (
    <Flex py={4} justify="space-between">
      <div>
        <Tabs
          display="inline-block"
          className="icon-tabs"
          onChange={handleOnViewChange}
          variant="soft-rounded"
          isManual={true}
          defaultIndex={defaultIndex}
        >
          <TabList aria-orientation="vertical">
            {viewTabs.map(({ name, icon: iconName, key }) => (
              <Tab key={key} aria-label={t(name)} aria-controls={`view_${key}`}>
                <Icon name={iconName} /> {t(name)}
              </Tab>
            ))}
          </TabList>
        </Tabs>
        {observationData.n > 0 && (
          <Text color="gray.600" mt={4}>
            {toHumanString(observationData.n)} {t("LIST.OBSERVATIONS_FOUND")}
          </Text>
        )}
      </div>
      <div>
        <Select
          maxW="10rem"
          aria-label={t("LIST.SORT_BY")}
          value={filter.sort}
          onChange={handleOnSort}
        >
          {sortByOptions.map(({ name, key }) => (
            <option key={key} value={key}>
              {t(name)}
            </option>
          ))}
        </Select>
      </div>
    </Flex>
  );
}
