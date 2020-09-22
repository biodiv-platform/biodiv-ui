import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/core";
import Tooltip from "@components/@core/tooltip";
import useObservationFilter from "@components/pages/observation/common/use-observation-filter";
import styled from "@emotion/styled";
import useTranslation from "@hooks/use-translation";
import { ObservationData } from "@interfaces/custom";
import { actionTabs } from "@static/observation-list";
import { Mq } from "mq-styled-components";
import React, { useState } from "react";

import ImageBoxComponent from "./image";
import CommentsTab from "./tabs/comments";
import CustomFieldsTab from "./tabs/custom-fields";
import GroupsTab from "./tabs/groups";
import InfoTab from "./tabs/info";
import RecoSuggestionTab from "./tabs/reco-suggestion";
import TraitsTab from "./tabs/traits";

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

export default function Container({ o }) {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const { setObservationData } = useObservationFilter();

  const recoUpdated = (payload) => {
    setObservationData((_draft: ObservationData) => {
      const i = _draft.l.findIndex((ob) => o.observationId === ob.observationId);
      _draft.l[i].recoShow = payload;
    });
  };

  return (
    <Flex
      className="white-box fade view_list"
      direction={["column", "column", "row", "row"]}
      justify="space-between"
      mb={4}
      overflow="hidden"
    >
      <ImageBoxComponent o={o} />
      <VerticalTabs>
        <Tabs variant="unstyled" className="tabs" index={tabIndex} onChange={setTabIndex}>
          <TabPanels className="tab-content" position="relative">
            <TabPanel>
              <InfoTab o={o} recoUpdated={recoUpdated} setTabIndex={setTabIndex} />
            </TabPanel>
            <TabPanel>
              <RecoSuggestionTab o={o} tabIndex={tabIndex} recoUpdated={recoUpdated} />
            </TabPanel>
            <TabPanel>
              <GroupsTab o={o} tabIndex={tabIndex} />
            </TabPanel>
            <TabPanel>{tabIndex === 3 && <TraitsTab o={o} />}</TabPanel>
            <TabPanel>{tabIndex === 4 && <CustomFieldsTab o={o} />}</TabPanel>
            <TabPanel>
              <CommentsTab tabIndex={tabIndex} observationId={o.observationId} />
            </TabPanel>
          </TabPanels>
          <TabList>
            {actionTabs.map(({ name, icon }) => (
              <Tab key={name}>
                <Tooltip title={t(name)}>
                  <div>
                    {icon} <span>{t(name)}</span>
                  </div>
                </Tooltip>
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </VerticalTabs>
    </Flex>
  );
}
