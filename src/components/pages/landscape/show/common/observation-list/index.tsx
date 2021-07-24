import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Tooltip from "@components/@core/tooltip";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import styled from "@emotion/styled";
import { Mq } from "mq-styled-components";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useMemo, useState } from "react";

import ReadMore from "../read-more";
import InfoTabView from "./info-tab";

export const observationListParams = {
  geoShapeFilterField: "location",
  max: 6
};

const VerticalTabs = styled.div`
  flex-grow: 1;

  .tabs {
    display: flex;

    > .tab-content {
      flex-grow: 1;

      > [role="tabpanel"] {
        padding: 0;
        height: 100%;
        max-height: 18rem;
        overflow-y: auto;
        position: relative;
      }
    }

    > [role="tablist"] {
      flex-direction: column;

      flex-shrink: 0;

      > [role="tab"] {
        display: block;

        width: 100%;
        height: 3rem;

        text-align: left;
        white-space: nowrap;

        color: var(--gray-600);
        border-bottom: 1px solid var(--gray-300);
        border-left: 1px solid var(--gray-300);
        background: var(--gray-50);
        filter: grayscale(1);
      }

      > [role="tab"]:last-child {
        border-bottom: 0;
      }

      > [role="tab"][aria-selected="true"] {
        white-space: nowrap;

        color: inherit;
        border-left-color: transparent;
        background: white;

        filter: none;
      }
    }
  }

  ${Mq.max.sm} {
    .tabs {
      display: flex;
      flex-direction: column-reverse;

      > [role="tablist"] {
        overflow-x: scroll;
        flex-direction: row;

        width: 100%;
      }
    }
  }

  ${Mq.min.md + " and (max-width: 1024px)"} {
    [role="tab"] span {
      display: none;
    }
  }
`;

export default function LandscapeObservationList({ sGroupList }) {
  const { t } = useTranslation();
  const { speciesGroup, observationData, setFilter } = useObservationFilter();
  const [tabIndex, setTabIndex] = useState(0);

  const speciesGroupList = useMemo(
    () =>
      speciesGroup
        ?.filter((o) => o.name !== "All" || !sGroupList.includes(o.id)) // removes All and non-specified from filter explicitly
        .sort((a, b) => (a?.order || 0) - (b.order || 0)),
    speciesGroup
  );

  const handleChange = (index) => {
    setTabIndex(index);
    setFilter((_draft) => {
      _draft.f.sGroup = speciesGroupList && speciesGroupList[index]?.id?.toString();
    });
  };

  useEffect(() => {
    handleChange(0);
  }, []);
  return (
    <Flex
      className="white-box fade view_list"
      direction={["column", "column", "row", "row"]}
      justify="space-between"
      mt={4}
      overflow="hidden"
    >
      <VerticalTabs>
        <Tabs
          isLazy={true}
          h={{ md: "100%" }}
          variant="unstyled"
          className="tabs"
          index={tabIndex}
          onChange={handleChange}
        >
          <TabPanels className="tab-content" position="relative">
            {speciesGroupList?.map((item, index) => (
              <TabPanel key={index}>
                <InfoTabView observationData={observationData} />
                <ReadMore
                  params={{ sGroup: item.id, geoEntity: observationData.l[0]?.placeName }}
                  dataType="observation"
                />
              </TabPanel>
            ))}
          </TabPanels>
          <TabList>
            {speciesGroupList?.map(({ name }) => (
              <Tab key={name}>
                <Tooltip title={t(name || "UNKNOWN")}>
                  <div>{t(name || "UNKNOWN")}</div>
                </Tooltip>
              </Tab>
            ))}
            <Box borderLeft="1px" borderColor="gray.300" flexGrow={1} />
          </TabList>
        </Tabs>
      </VerticalTabs>
    </Flex>
  );
}
